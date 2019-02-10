const chokidar = require('chokidar');

const options = {
  ignoreInitial: true,
  ignorePermissionErrors: true,
  followSymlinks: true,
  interval: 1000,
  binaryInterval: 1000,
  disableGlobbing: true,
  ignored: /(?:node_modules|bin|dist|vendor)/
};

module.exports.watch = (io, path) => {
  const watcher = chokidar.watch(path, options);
  watcher.on('all', (event, file) => io.emit('activity', { event, file }));
};
