import { Router } from 'express';
import Controller from '../controllers/Question.js';
import auth from '../middlewares/auth.js';
import verifyPublished from '../middlewares/verifyPublished.js';
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
    auth,
    Controller.readAll,
  )
  .get(
    '/:questionId',
    validate(questionIdSchema, 'params'),
    auth,
    Controller.readById,
  )
  .post(
    '/',
    validate(formIdSchema, 'params'),
    auth,
    validate(createQuestionSchema),
    verifyPublished,
    Controller.create,
  )
  .put(
    '/:questionId',
    validate(questionIdSchema, 'params'),
    auth,
    validate(updateQuestionSchema),
    verifyPublished,
    Controller.update,
  )
  .delete(
    '/:questionId',
    validate(questionIdSchema, 'params'),
    auth,
    verifyPublished,
    Controller.delete,
  );

export default router;
