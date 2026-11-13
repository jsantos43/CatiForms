import { Router } from 'express';
import Controller from '../controllers/Question.js';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { formIdSchema } from '../schemas/Form.js';
import {
  createQuestionSchema,
  questionIdSchema,
  updateQuestionSchema,
} from '../schemas/Question.js';

const router = Router({ mergeParams: true });

router
  .get(
    '/',
    validate(formIdSchema, 'params'),
    auth('forms:read'),
    Controller.readAll,
  )
  .get(
    '/:questionId',
    validate(questionIdSchema, 'params'),
    auth('forms:read'),
    Controller.readById,
  )
  .post(
    '/',
    validate(formIdSchema, 'params'),
    auth('forms:edit'),
    validate(createQuestionSchema),
    Controller.create,
  )
  .put(
    '/:questionId',
    validate(questionIdSchema, 'params'),
    auth('forms:edit'),
    validate(updateQuestionSchema),
    Controller.update,
  )
  .delete(
    '/:questionId',
    validate(questionIdSchema, 'params'),
    auth('forms:edit'),
    Controller.delete,
  );

export default router;
