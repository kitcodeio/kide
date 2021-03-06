const fs = require('fs');
const Hapi = require("hapi");
const Inert = require("inert");
const path = require('path');

const socket = require('./socket');
const routes = require('./routes');
//const update = require('./update');

const server = new Hapi.Server();

if(process.argv[2])
  if(!fs.existsSync(process.argv[2]))
    fs.mkdirSync(process.argv[2]);

socket.setPath(process.argv[2] || path.join(process.cwd()));

async function start() {
  server.connection({
    host: "0.0.0.0",
    port: "54123",
    routes: {
      cors: true
    }
  });
  socket.register(server);
  await server.register([Inert]);
  server.route(routes);
  await server.start();
  console.log("kide is online at " + server.info.uri);
  //update.init();
}

start();
