import type { Express, Request, Response } from 'express';
import auth from './auth.js';
import user from './user.js';
import forms from './forms.js';
import questions from './questions.js';

const routes = (app: Express) => {
  app.get('/', (req: Request, res: Response) => {
    res.json({ mensagem: 'Olá, mundo!' });
  });

  app.use(user, auth, forms, questions);
};

export default routes;
