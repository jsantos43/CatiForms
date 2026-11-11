import type { Express, Request, Response } from 'express';
import auth from './auth.js';
import user from './user.js';

const routes = (app: Express) => {
  app.get('/', (req: Request, res: Response) => {
    res.json({ mensagem: 'Olá, mundo!' });
  });

  app.use(user, auth);
};

export default routes;
