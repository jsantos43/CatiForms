import app from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, () => {
  console.log(`\x1b[32m${`✔ CatiForms API rodando em http://localhost:${env.port}`}\x1b[0m`);
});
