const os = require('os');
const pty = require("node-pty");

module.exports = (size, path) => {
  return pty.spawn((os.platform() === 'win32' ? 'powershell.exe' : 'bash'), [], {
    name: 'xterm-color',
    cols: size.cols,
    rows: size.rows,
    cwd: path,
    env: process.env
  });
}
