const fs = require('fs');

module.exports = {
  async readDir(path) {
    return new Promise((resolve, reject) => {
      let dirList = [];
      let filesList = [];
      fs.readdir(path, (err, files) => {
        files.forEach(file => {
          fs.stat(path + '/' + file, (err, stats) => {
            if (stats.isDirectory()) dirList.push({
              type: 'dir',
              uri: path + '/' + file,
              name: file
            });
            else filesList.push({
              type: 'file',
              uri: path + '/' + file,
              name: file
            });
            if ((dirList.length + filesList.length) == files.length)
              return resolve(dirList.concat(filesList));
          });
        });
      });
    });
  },
  async readFile(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, {
        encoding: 'utf-8'
      }, (err, content) => {
        if (!err) return resolve(content);
      });
    });
  },
  async writeFile(file) {
    return new Promise((resolve, reject) => {
      fs.writeFile(file.uri, file.content, err => {
        if (err) return resolve({
          status: 'error',
          error: err
        });
        return resolve('file:saved', {
          status: 'success',
          message: 'file successfully saved'
        });
      });
    });
  }
}
