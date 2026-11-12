import { Router } from 'express';
import Controller from '../controllers/Questions.js';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import {
  createQuestionSchema,
  questionIdSchema,
  updateQuestionSchema,
} from '../schemas/Question.js';

const router = Router();

router
  .get(
    '/questions/:id',
    auth('logged'),
    validate(questionIdSchema, 'params'),
    Controller.readById
  )
  .post(
    '/questions',
    auth('logged'),
    validate(createQuestionSchema),
    Controller.create
  )
  .put(
    '/questions/:id',
    auth('logged'),
    validate(questionIdSchema, 'params'),
    validate(updateQuestionSchema),
    Controller.update,
  )
  .delete(
    '/questions/:id',
    auth('logged'),
    validate(questionIdSchema, 'params'),
    Controller.delete
  );

export default router;
