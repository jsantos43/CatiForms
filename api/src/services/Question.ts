import { InvalidRequest, NotFound } from '../errors/index.js';
import { db } from '../prisma/db.js';
import { MIN_OPTIONS, type OptionData } from '../schemas/Option.js';
import type { CreateQuestionData, QuestionType, UpdateQuestionData } from '../schemas/Question.js';

// `db.orm` ou `tx.orm`: permite reaproveitar as queries dentro de uma transação.
type Orm = typeof db.orm;

const questions = (orm: Orm = db.orm) =>
  orm.public.Question.select('id', 'formId', 'type', 'title', 'position', 'options');

class Question {
  static async readAll(formId: string) {
    return await questions()
      .where({ formId })
      .orderBy((q) => q.position.asc())
      .all();
  }

  static async readById(formId: string, questionId: string) {
    return await Question.findOne(db.orm, formId, questionId);
  }

  static async create(formId: string, data: CreateQuestionData) {
    return await db.transaction(async (tx) => {
      const { type, title, position } = data;
      const options = 'options' in data ? data.options : [];

      return await questions(tx.orm).create({ formId, type, title, position, options });
    });
  }

  static async update(formId: string, questionId: string, data: UpdateQuestionData) {
    return await db.transaction(async (tx) => {
      const current = await Question.findOne(tx.orm, formId, questionId);

      // Quando o type enviado é TEXT, o schema já removeu as options do body.
      const { options, ...fields }: UpdateQuestionData & { options?: OptionData[] } = data;
      const type: QuestionType = fields.type ?? current.type;
      const changes: typeof fields & { options?: OptionData[] } = { ...fields };

      if (type === 'TEXT') {
        if (options && options.length > 0) {
          throw new InvalidRequest('Text questions do not have options');
        }

        // Virou TEXT: as options antigas deixam de fazer sentido.
        if (current.options.length > 0) changes.options = [];
      } else if (options) {
        if (options.length < MIN_OPTIONS) {
          throw new InvalidRequest(`Choice questions need at least ${MIN_OPTIONS} options`);
        }

        // As options enviadas substituem as atuais.
        changes.options = options;
      }

      if (Object.keys(changes).length > 0) {
        await tx.orm.public.Question.where({ id: questionId, formId }).update(changes);
      }

      return await Question.findOne(tx.orm, formId, questionId);
    });
  }

  static async delete(formId: string, questionId: string) {
    return await db.transaction(async (tx) => {
      const question = await Question.findOne(tx.orm, formId, questionId);

      await tx.orm.public.Question.where({ id: questionId, formId }).delete();

      return question;
    });
  }

  static async findOne(orm: Orm, formId: string, questionId: string) {
    // Filtra pelo form também: o usuário só tem permissão sobre o form da URL.
    const question = await questions(orm).first({ id: questionId, formId });

    if (!question) throw new NotFound('Question not found');

    return question;
  }
}

export default Question;
