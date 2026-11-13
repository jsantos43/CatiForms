import type { Express, Request, Response } from 'express';
import auth from './auth.js';
import user from './user.js';
import form from './form.js';
import response from './response.js';

const routes = (app: Express) => {
  app.get('/', (req: Request, res: Response) => {
    res.json({ mensagem: 'Olá, mundo!' });
  });

  app.use(user, auth, form, response);
};

export default routes;
