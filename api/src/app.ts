import express from 'express';
import handleError from './middlewares/handleError.js';
import handleNotFound from './middlewares/handleNotFound.js';
import routes from './routes/index.js';

const app = express();

app.use(express.json());

routes(app);
app.use(handleNotFound);
app.use(handleError);

export default app;
