import "./src/config.js";
import app from "./src/app.js";
import { getEnv } from "./src/config.js";
import bootstrap from "./src/bootstrap.js";

const port = getEnv("port") ?? 2780;

app.listen(port, () => {
  console.log(`Server listen at http://127.0.0.1:${port}`);
});

bootstrap();
