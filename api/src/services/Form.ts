import { NotFound } from '../errors/index.js';
import { db } from '../prisma/db.js';
import type { CreateFormData, UpdateFormData } from '../schemas/Form.js';
import type { AuthUser } from '../types/express.js';

const formFields = ['id', 'title', 'description', 'collectEmail', 'authorId', 'createdAt'] as const;

const forms = () => db.orm.public.Form.select(...formFields);

// Listagem: dados do form + autor + quantidade de perguntas.
const formSummaries = () =>
  forms()
    .include('author', (author) => author.select('id', 'username', 'name'))
    .include('questions', (questions) => questions.count())
    .orderBy((f) => f.createdAt.desc());

class Form {
  static async readAll() {
    return await formSummaries().all();
  }

  static async readByAuthor(authorId: string) {
    return await formSummaries().where({ authorId }).all();
  }

  static async readById(id: string) {
    const form = await forms()
      .include('author', (author) => author.select('id', 'username', 'name'))
      .include('questions', (questions) =>
        questions
          .select('id', 'type', 'title', 'position')
          .orderBy((q) => q.position.asc())
          .include('options', (options) =>
            options.select('id', 'label', 'position').orderBy((o) => o.position.asc()),
          ),
      )
      .first({ id });

    if (!form) throw new NotFound('Form not found');

    return form;
  }

  static async create(authorId: string, data: CreateFormData) {
    return await forms().create({ ...data, authorId });
  }

  static async update(id: string, data: UpdateFormData) {
    const form = await forms().where({ id }).update(data);

    if (!form) throw new NotFound('Form not found');

    return form;
  }

  static async delete(id: string) {
    return await db.transaction(async (tx) => {
      const questions = await tx.orm.public.Question.select('id').where({ formId: id }).all();
      const questionIds = questions.map((q) => q.id);

      if (questionIds.length > 0) {
        await tx.orm.public.Option.where((o) => o.questionId.in(questionIds)).deleteAll();
        await tx.orm.public.Question.where({ formId: id }).deleteAll();
      }

      const form = await tx.orm.public.Form.select(...formFields)
        .where({ id })
        .delete();

      if (!form) throw new NotFound('Form not found');

      return form;
    });
  }

  // Usado pelo middleware de auth nas permissões "forms:*".
  // Admin ou dono do form. Futuramente: usuários com quem o form foi compartilhado.
  static async canManage(user: AuthUser, formId?: string) {
    if (user.admin) return true;
    if (!formId) return false;

    const form = await db.orm.public.Form.select('authorId').first({ id: formId });

    if (!form) throw new NotFound('Form not found');

    return form.authorId === user.id;
  }
}

export default Form;
