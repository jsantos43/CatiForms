import { Router } from 'express';
import Controller from '../controllers/User.js';
import validate from '../middlewares/validate.js';
import { createUserSchema, userIdSchema, updateUserSchema } from '../schemas/User.js';

const router = Router();

router
  .get('/user', Controller.readAll)
  .get('/user/:id', validate(userIdSchema, 'params'), Controller.readById)
  .post('/user', validate(createUserSchema), Controller.create)
  .put('/user/:id', validate(userIdSchema, 'params'), validate(updateUserSchema), Controller.update)
  .delete('/user/:id', validate(userIdSchema, 'params'), Controller.delete);

export default router;
