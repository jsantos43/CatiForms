import { Router } from 'express';
import Controller from '../controllers/User.js';
import validate from '../middlewares/validate.js';
import { createUserSchema, userIdSchema } from '../schemas/User.js';

const router = Router();

router
  .get('/user', Controller.readAll)
  .get('/user/:id', validate(userIdSchema, 'params'), Controller.readById)
  .post('/user', validate(createUserSchema), Controller.create)
  .put('/user', Controller.update)
  .delete('/user', Controller.delete);

export default router;
