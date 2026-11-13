import type { Express, Request, Response } from 'express';
import auth from './auth.js';
import user from './user.js';
import form from './form.js';
import question from './question.js';

const routes = (app: Express) => {
  app.get('/', (req: Request, res: Response) => {
    res.json({ mensagem: 'Olá, mundo!' });
  });

  app.use(user, auth, form, question);
};

export default routes;
