const Hapi = require("hapi");
const Inert = require("inert");

const socket = require('./socket');
const routes = require('./routes');

const server = new Hapi.Server();

socket.setPath(process.argv[2] || '.');

async function start() {
  server.connection({
    host: "0.0.0.0",
    port: "8080",
    routes: {
      cors: true
    }
  });
  socket.register(server);
  await server.register([Inert]);
  server.route(routes);
  await server.start();
  console.log("kide is online at " + server.info.uri);
}

start();
