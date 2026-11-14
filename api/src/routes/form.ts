import { Router } from 'express';
import Controller from '../controllers/Form.js';
import auth from '../middlewares/auth.js';
import verifyPublished from '../middlewares/verifyPublished.js';
import validate from '../middlewares/validate.js';
import { createFormSchema, formIdSchema, formSlugSchema, updateFormSchema } from '../schemas/Form.js';
import question from './question.js';

const router = Router();

router
  .get(
    '/forms',
    auth,
    Controller.readAll
  )
  .get(
    '/forms/:id',
    validate(formIdSchema, 'params'),
    auth,
    Controller.readById
  )
  .get(
    '/f/:slug',
    validate(formSlugSchema, 'params'),
    Controller.readPublic
  )
  .post(
    '/forms',
    auth,
    validate(createFormSchema),
    Controller.create
  )
  .put(
    '/forms/:id',
    validate(formIdSchema, 'params'),
    auth,
    validate(updateFormSchema),
    verifyPublished,
    Controller.update,
  )
  .delete(
    '/forms/:id',
    validate(formIdSchema, 'params'),
    auth,
    verifyPublished,
    Controller.delete
  )
  .use('/forms/:id/questions', question);

export default router;
