const xterm = require('./xterm');
const fs = require('./fs');

const shell = {};

var path = "";

module.exports.setPath = folderPath => path = folderPath;

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
        shell[socket.id] = xterm(size, path);
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

    socket.on('xterm:resize', size => {
      if(shell[socket.id]) shell[socket.id].resize(size.cols, size.rows)
    });

    socket.on('modules', async modules => {
      await fs.writeFile({uri: __dirname + '/modules.json', content: modules});
      socket.emit('completed');
      socket.disconnect()
    });

    socket.on('disconnect', () => {
      if (shell[socket.id]) shell[socket.id].write('exit\n');
      delete shell[socket.id];
    });

  });
}
