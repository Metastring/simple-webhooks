const http = require("http");
const { spawn } = require("child_process");

const DEFAULT_CONFIG = {
  hostname: '127.0.0.1',
  port: 8080,
  reload: "/reloadConfig",
  listeners: {},
};

const loadConfig = () => {
  try {
    return require("./config");
  } catch {
    return DEFAULT_CONFIG;
  }
};

let config = loadConfig();

const requestListener = function (req, res) {
  console.log(`Received request on ${req.url}`);

  if (req.url === (config.reload || DEFAULT_CONFIG.reload)) {
    res.writeHead(200);
    delete require.cache[require.resolve("./config")];
    config = loadConfig();
    res.end("Reloded config");
    return;
  }

  if (req.url in config.listeners) {
    res.writeHead(200);
    const [command, ...args] = config.listeners[req.url].split(" ");
    const execution = spawn(command, args);
    execution.stdout.on("data", (data) => res.write(data));
    execution.stderr.on("data", (data) => res.write(data));
    execution.on("close", () => res.end());
    return;
  }

  res.writeHead(404);
  res.end("No such endpoint");
};

const server = http.createServer(requestListener);
server.listen(config.port || DEFAULT_CONFIG.port, config.hostname || DEFAULT_CONFIG.hostname);

console.log(`listening on ${config.port || DEFAULT_CONFIG.port}`);
