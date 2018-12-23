const Hapi = require("hapi");
const Inert = require("inert");
const os = require('os');
const pty = require("node-pty");
const fs = require('fs');

const server = new Hapi.Server();

const path = "../demo"

var shell;

server.connection({
  host: "localhost",
  port: "8080",
  routes: {
    cors: true
  }
});

async function start() {
  const io = require('socket.io')(server.listener);
  io.on('connection', socket => {

    socket.on('init', data => {
      let result = [];
      fs.readdir(path, (err, files) => {
        files.forEach(file => {
          fs.stat(path + '/' + file, (err, stats) => {
            if (stats.isDirectory()) result.push({
              type: 'dir',
              uri: path + '/' + file,
              name: file
            });
            else result.push({
              type: 'file',
              uri: path + '/' + file,
              name: file
            });
            if (result.length == files.length) socket.emit('dir:list', result);
          });
        });
      })
    });

    socket.on('read:file', path => {
      fs.readFile(path, {
        encoding: 'utf-8'
      }, (err, content) => {
        if (!err) socket.emit('file', content);
      });
    });


    socket.on('read:dir', path => {
      let result = [];
      fs.readdir(path, (err, files) => {
        files.forEach(file => {
          fs.stat(path + '/' + file, (err, stats) => {
            if (stats.isDirectory()) result.push({
              type: 'dir',
              uri: path + '/' + file,
              name: file
            });
            else result.push({
              type: 'file',
              uri: path + '/' + file,
              name: file
            });
            if (result.length == files.length) socket.emit('dir:list', result);
          });
        });

      });
    });

    socket.on('save:file', file => {
      fs.writeFile(file.uri, file.content, err => {
        if (err) return socket.emit('file:saved', {
          status: 'error',
          error: err
        });
        return socket.emit('file:saved', {
          status: 'success',
          message: 'file successfully saved'
        });
      });
    });

    socket.on('init:xterm', (size) => {
      try {
        shell = pty.spawn((os.platform() === 'win32' ? 'powershell.exe' : 'bash'), [], {
          name: 'xterm-color',
          cols: size.cols,
          rows: size.rows,
          cwd: __dirname + '/../demo',
          env: process.env
        });
        socket.emit('xterm:ready', {});
	socket.on('xterm:key', key => {
          shell.write(key);
        });
        shell.on('data', data => {
          socket.emit('xterm:data', data);
        });
      } catch (error) {
        socket.emit('xterm:ready', {
          error
        });
      }
    });

    socket.on('disconnect', ()=> {
      delete shell;
    });

  });
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

/*
ptyProcess.on('data', function(data) {
  console.log(data);
});

ptyProcess.resize(100, 40);
*/
