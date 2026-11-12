import { Router } from 'express';
import Controller from '../controllers/Forms.js';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { createFormSchema, formIdSchema, updateFormSchema } from '../schemas/Form.js';

const router = Router();

router
  .get(
    '/forms',
    auth('logged'),
    Controller.read
  )
  .get(
    '/forms/all',
    auth('admin'),
    Controller.readAll
  )
  .get(
    '/forms/:id',
    auth('logged'),
    validate(formIdSchema, 'params'),
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
    auth('logged'),
    validate(formIdSchema, 'params'),
    validate(updateFormSchema),
    Controller.update,
  )
  .delete(
    '/forms/:id',
    auth('logged'),
    validate(formIdSchema, 'params'),
    Controller.delete
  );

export default router;
