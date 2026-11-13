import { InvalidRequest, NotFound } from '../errors/index.js';
import { db } from '../prisma/db.js';
import type { AnswerData, CreateResponseData } from '../schemas/Response.js';
import type { QuestionType } from '../schemas/Question.js';

type Orm = typeof db.orm;

type FormQuestion = {
  id: string;
  type: QuestionType;
  title: string;
  options: readonly { label: string }[];
};

const responses = (orm: Orm = db.orm) =>
  orm.public.Response.select('id', 'formId', 'email', 'submittedAt').include('answers', (answers) =>
    answers.select('questionId', 'text', 'choices'),
  );

class FormResponse {
  static async readAll(formId: string) {
    return await responses()
      .where({ formId })
      .orderBy((r) => r.submittedAt.desc())
      .all();
  }

  static async readById(formId: string, responseId: string) {
    return await FormResponse.findOne(db.orm, formId, responseId);
  }

  static async create(slug: string, data: CreateResponseData) {
    return await db.transaction(async (tx) => {
      const form = await tx.orm.public.Form.select('id', 'collectEmail')
        .include('questions', (questions) => questions.select('id', 'type', 'title', 'options'))
        .first({ slug, published: true });

      if (!form) throw new NotFound('Form not found');

      if (form.collectEmail && !data.email) {
        throw new InvalidRequest('email: Email is required for this form');
      }

      FormResponse.validateAnswers(form.questions, data.answers);

      const response = await tx.orm.public.Response.select('id').create({
        formId: form.id,
        email: form.collectEmail ? data.email : null,
      });

      await tx.orm.public.Answer.createAll(
        data.answers.map((answer) => ({
          responseId: response.id,
          questionId: answer.questionId,
          text: answer.text,
          choices: answer.choices,
        })),
      );

      return await FormResponse.findOne(tx.orm, form.id, response.id);
    });
  }

  static async findOne(orm: Orm, formId: string, responseId: string) {
    const response = await responses(orm).first({ id: responseId, formId });

    if (!response) throw new NotFound('Response not found');

    return response;
  }

  // Junta todos os problemas num único erro, para o front mostrar tudo de uma vez.
  // Como o form não tem campo "required", toda question precisa ser respondida.
  static validateAnswers(questions: FormQuestion[], answers: AnswerData[]) {
    const errors: string[] = [];
    const byQuestion = new Map(answers.map((answer) => [answer.questionId, answer]));
    const questionIds = new Set(questions.map((q) => q.id));

    for (const answer of answers) {
      if (!questionIds.has(answer.questionId)) {
        errors.push(`${answer.questionId}: Question does not belong to this form`);
      }
    }

    for (const question of questions) {
      const answer = byQuestion.get(question.id);
      const prefix = question.id;

      if (!answer) {
        errors.push(`${prefix}: "${question.title}" must be answered`);
        continue;
      }

      const labels = new Set(question.options.map((o) => o.label));
      const invalid = answer.choices.filter((choice) => !labels.has(choice));
      const repeated = new Set(answer.choices).size !== answer.choices.length;

      if (invalid.length > 0) errors.push(`${prefix}: Invalid choices: ${invalid.join(', ')}`);
      if (repeated) errors.push(`${prefix}: Choices cannot be repeated`);

      switch (question.type) {
        case 'TEXT':
          if (!answer.text) errors.push(`${prefix}: Text is required`);
          if (answer.choices.length > 0) errors.push(`${prefix}: Text questions have no choices`);
          break;

        case 'MULTIPLE_CHOICE':
          if (answer.choices.length === 0) errors.push(`${prefix}: Select at least one choice`);
          if (answer.text) errors.push(`${prefix}: Multiple choice questions have no text`);
          break;

        case 'SINGLE_CHOICE_JUSTIFIED':
          if (answer.choices.length !== 1) errors.push(`${prefix}: Select exactly one choice`);
          if (!answer.text) errors.push(`${prefix}: A justification is required`);
          break;
      }
    }

    if (errors.length > 0) throw new InvalidRequest(errors);
  }
}

export default FormResponse;
