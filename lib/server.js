const Hapi = require("hapi");
const Inert = require("inert");

const socket = require('./socket');

const server = new Hapi.Server();

socket.setPath(process.argv[2] || '.');

async function start() {
  server.connection({
    host: "localhost",
    port: "8080",
    routes: {
      cors: true
    }
  });
  socket.register(server);
  await server.register([Inert]);
  server.route({
    method: "GET",
    path: "/{path*}",
    config: {
      handler: {
        directory: {
          path: __dirname + "/../dist/kide"
        }
      }
    }
  });
  await server.start();
  console.log("kide is online at " + server.info.uri);
}

start();
