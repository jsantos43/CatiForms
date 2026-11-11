import { Router } from 'express';
import Controller from '../controllers/User.js';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { createUserSchema, userIdSchema, updateUserSchema } from '../schemas/User.js';

const router = Router();

router
  .get('/user', auth('logged'), Controller.readAll)
  .get('/user/all', auth('admin'), Controller.readAll)
  .get('/user/:id', auth('logged'), validate(userIdSchema, 'params'), Controller.readById)
  .post('/user', validate(createUserSchema), Controller.create)
  .put(
    '/user/:id',
    auth('self'),
    validate(userIdSchema, 'params'),
    validate(updateUserSchema),
    Controller.update,
  )
  .delete('/user/:id', auth('self'), validate(userIdSchema, 'params'), Controller.delete);

export default router;
