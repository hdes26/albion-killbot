require("dotenv").config();
const parseArgs = require("minimist");
const path = require("node:path");

const args = parseArgs(process.argv.slice(2));
if (args.mode) {
  process.env.MODE = args.mode;
}
process.env.NODE_CONFIG_DIR = args.configDir || path.join(__dirname, "..", "config");

const interfaces = path.join(__dirname, "..", "src");

const modes = [
  {
    name: "bot",
    description: "Component that consumes the queue and publishes kills to Discord servers.",
    entryPoint: path.join(interfaces, "bot"),
  },
  {
    name: "api",
    description: "Web API to interact with server configurations and see events.",
    entryPoint: path.join(interfaces, "api"),
  },
];

async function start() {

  const mode = modes.find((m) => m.name == process.env.MODE);
  if (!mode) {
    console.log(`Please select an mode from the following:\n`);
    modes.forEach((mode) => {
      console.log(`\t${mode.name}\t- ${mode.description}`);
    });
    console.log(`\nTIP: You can use MODE env var or --mode command-line argument.`);
    process.exit(0);
  }

  try {    
    const { run, cleanup } = require(mode.entryPoint);

    if (cleanup) {
      //catches ctrl+c event
      process.once("SIGINT", await cleanup);
      // graceful shutdown when using nodemon
      process.once("SIGHUP", await cleanup);
      process.once("SIGUSR2", await cleanup);
    }

    //catches uncaught exceptions
    process.on("uncaughtException", async (error) => {
      console.error(`Uncaught exception:`, error);
    });

    await run();
  } catch (error) {
    console.error(`An error ocurred while running ${mode.name}: ${error.message}`, { error });
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}
