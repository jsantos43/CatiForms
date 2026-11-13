import type { NextFunction, Request, Response } from 'express';
import type { FormIdParams } from '../schemas/Form.js';
import type {
  CreateQuestionData,
  QuestionIdParams,
  UpdateQuestionData,
} from '../schemas/Question.js';
import Service from '../services/Question.js';

class Question {
  static async readAll(req: Request<FormIdParams>, res: Response, next: NextFunction) {
    try {
      const questions = await Service.readAll(req.params.id);

      return res.status(200).json({ success: true, questions });
    } catch (err) {
      return next(err);
    }
  }

  static async readById(req: Request<QuestionIdParams>, res: Response, next: NextFunction) {
    try {
      const question = await Service.readById(req.params.id, req.params.questionId);

      return res.status(200).json({ success: true, question });
    } catch (err) {
      return next(err);
    }
  }

  static async create(
    req: Request<FormIdParams, unknown, CreateQuestionData>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const question = await Service.create(req.params.id, req.body);

      return res.status(201).json({ success: true, question });
    } catch (err) {
      return next(err);
    }
  }

  static async update(
    req: Request<QuestionIdParams, unknown, UpdateQuestionData>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const question = await Service.update(req.params.id, req.params.questionId, req.body);

      return res.status(200).json({ success: true, question });
    } catch (err) {
      return next(err);
    }
  }

  static async delete(req: Request<QuestionIdParams>, res: Response, next: NextFunction) {
    try {
      const question = await Service.delete(req.params.id, req.params.questionId);

      return res.status(200).json({ success: true, question });
    } catch (err) {
      return next(err);
    }
  }
}

export default Question;
