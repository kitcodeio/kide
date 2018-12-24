const os = require('os');
const pty = require("node-pty");

module.exports = size => {
  return pty.spawn((os.platform() === 'win32' ? 'powershell.exe' : 'bash'), [], {
    name: 'xterm-color',
    cols: size.cols,
    rows: size.rows,
    cwd: __dirname + '/../../demo',
    env: process.env
  });
}
