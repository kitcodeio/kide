const xterm = require('./xterm');
const fs = require('./fs');

const path = "../demo";
const shell = {};

module.exports.register = server => {
  const io = require('socket.io')(server.listener);
  io.on('connection', socket => {

    socket.on('init', async data => {
      socket.emit('dir:list', await fs.readDir(path));
    });

    socket.on('read:file', async path => {
      socket.emit('file', await fs.readFile(path));
    });

    socket.on('read:dir', async path => {
      socket.emit('dir:list', await fs.readDir(path));
    });

    socket.on('save:file', async file => {
      socket.emit('file:saved', await fs.writeFile(file));
    });

    socket.on('init:xterm', (size) => {
      try {
        shell[socket.id] = xterm(size);
        socket.emit('xterm:ready');
        socket.on('xterm:key', key => {
          shell[socket.id].write(key);
        });
        shell[socket.id].on('data', data => {
          socket.emit('xterm:data', data);
        });
      } catch (error) {
        socket.emit('xterm:ready', {
          error
        });
      }
    });

    socket.on('disconnect', () => {
      delete shell[socket.id];
    });

  });
}
