import { Router } from 'express';
import Controller from '../controllers/Response.js';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { formIdSchema, formSlugSchema } from '../schemas/Form.js';
import { createResponseSchema, responseIdSchema } from '../schemas/Response.js';

const router = Router();

router
  .get(
    '/forms/:id/responses',
    validate(formIdSchema, 'params'),
    auth,
    Controller.readAll,
  )
  .get(
    '/forms/:id/responses/:responseId',
    validate(responseIdSchema, 'params'),
    auth,
    Controller.readById,
  )
  .post(
    '/f/:slug/responses',
    validate(formSlugSchema, 'params'),
    validate(createResponseSchema),
    Controller.create,
  );

export default router;
