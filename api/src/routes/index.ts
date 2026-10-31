import type { Express, Request, Response } from 'express';

const routes = (app: Express) => {
  app.get("/", (req: Request, res: Response) => {
    res.json({ mensagem: "Olá, mundo!" });
  });
};

export default routes;
