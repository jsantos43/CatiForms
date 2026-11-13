import { Router } from 'express';
import Controller from '../controllers/Form.js';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { createFormSchema, formIdSchema, updateFormSchema } from '../schemas/Form.js';
import question from './question.js';

const router = Router();

router
  .get(
    '/forms',
    auth('logged'),
    Controller.readOwn
  )
  .get(
    '/forms/all',
    auth('admin'),
    Controller.readAll
  )
  .get(
    '/forms/:id',
    validate(formIdSchema, 'params'),
    auth('forms:read'),
    Controller.readById
  )
  .post(
    '/forms',
    auth('logged'),
    validate(createFormSchema),
    Controller.create
  )
  .put(
    '/forms/:id',
    validate(formIdSchema, 'params'),
    auth('forms:edit'),
    validate(updateFormSchema),
    Controller.update,
  )
  .delete(
    '/forms/:id',
    validate(formIdSchema, 'params'),
    auth('forms:owner'),
    Controller.delete
  )
  .use('/forms/:id/questions', question);

export default router;
