import "./src/config.js";
import app from "./src/app.js";
import { getEnv } from "./src/config.js";

const port = getEnv("port") ?? 2780;

app.listen(port, () => {
  console.log(`Server listen at http://0.0.0.0:${port}`);
});
