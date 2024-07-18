import "./src/config.js";
import { question } from "./src/utils.js";
import { handleCmd } from "./src/cmd.js";

async function main() {
  console.log("Enter Your Command:");
  while (true) {
    const cmd = await question("");
    await handleCmd(cmd);
  }
}

main();
