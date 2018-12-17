const Hapi = require("hapi");
const Inert = require("inert");

const server = new Hapi.Server();

server.connection({
  host: "localhost",
  port: "8080",
  routes: {
    cors: true
  }
});

async function start() {
  await server.register([Inert]);
  server.route({
    method: "GET",
    path: "/{path*}",
    config: {
      handler: {
        directory: {
          path: __dirname + "/dist/kide"
        }
      }
    }
  });
  await server.start();
  console.log("kide is online at " + server.info.uri);
}

start();
