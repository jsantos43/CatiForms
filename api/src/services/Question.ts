import { InvalidRequest, NotFound } from '../errors/index.js';
import { db } from '../prisma/db.js';
import { MIN_OPTIONS, type OptionData } from '../schemas/Option.js';
import type { CreateQuestionData, QuestionType, UpdateQuestionData } from '../schemas/Question.js';

// `db.orm` ou `tx.orm`: permite reaproveitar as queries dentro de uma transação.
type Orm = typeof db.orm;

const questions = (orm: Orm = db.orm) =>
  orm.public.Question.select('id', 'formId', 'type', 'title', 'position');

const questionsWithOptions = (orm: Orm = db.orm) =>
  questions(orm).include('options', (options) =>
    options.select('id', 'label', 'position').orderBy((o) => o.position.asc()),
  );

class Question {
  static async readAll(formId: string) {
    return await questionsWithOptions()
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

      const question = await questions(tx.orm).create({ formId, type, title, position });

      if ('options' in data) await Question.createOptions(tx.orm, question.id, data.options);

      return await Question.findOne(tx.orm, formId, question.id);
    });
  }

  static async update(formId: string, questionId: string, data: UpdateQuestionData) {
    return await db.transaction(async (tx) => {
      const current = await Question.findOne(tx.orm, formId, questionId);

      // Quando o type enviado é TEXT, o schema já removeu as options do body.
      const { options, ...fields }: UpdateQuestionData & { options?: OptionData[] } = data;
      const type: QuestionType = fields.type ?? current.type;

      if (type === 'TEXT') {
        if (options && options.length > 0) {
          throw new InvalidRequest('Text questions do not have options');
        }

        // Virou TEXT: as options antigas deixam de fazer sentido.
        if (current.options.length > 0) {
          await tx.orm.public.Option.where({ questionId }).deleteAll();
        }
      } else if (options) {
        if (options.length < MIN_OPTIONS) {
          throw new InvalidRequest(`Choice questions need at least ${MIN_OPTIONS} options`);
        }

        // As options enviadas substituem as atuais.
        await tx.orm.public.Option.where({ questionId }).deleteAll();
        await Question.createOptions(tx.orm, questionId, options);
      }

      if (Object.keys(fields).length > 0) {
        await tx.orm.public.Question.where({ id: questionId, formId }).update(fields);
      }

      return await Question.findOne(tx.orm, formId, questionId);
    });
  }

  static async delete(formId: string, questionId: string) {
    return await db.transaction(async (tx) => {
      const question = await Question.findOne(tx.orm, formId, questionId);

      // As options referenciam a question, então precisam sair antes dela.
      await tx.orm.public.Option.where({ questionId }).deleteAll();
      await tx.orm.public.Question.where({ id: questionId, formId }).delete();

      return question;
    });
  }

  static async findOne(orm: Orm, formId: string, questionId: string) {
    // Filtra pelo form também: o usuário só tem permissão sobre o form da URL.
    const question = await questionsWithOptions(orm).first({ id: questionId, formId });

    if (!question) throw new NotFound('Question not found');

    return question;
  }

  // A posição de cada option é a ordem em que ela veio no array.
  static async createOptions(orm: Orm, questionId: string, options: OptionData[]) {
    if (options.length === 0) return;

    await orm.public.Option.createAll(
      options.map((option, position) => ({ questionId, label: option.label, position })),
    );
  }
}

export default Question;
