const fs = require('fs');
const exec = require('child_process').exec;

const version = require('../package.json').version;

const pull = async () => {
  return new Promise((resolve, reject)=>{
    exec('git pull origin master', (error, stdout, stderr) => {
      if (error) return reject(error);
      resolve();
    });
  });
};

const isUpdated = async () => {
  return version !== JSON.parse(await fs.promises.readFile(__dirname + '/../package.json')).version;
};

const build = async () => {
  return new Promise((resolve, reject) => {
    exec(__dirname + '/../node_modules/.bin/ng build --prod', (error, stdout, stderr) => {
      if (error) return reject(error);
      resolve();
    });
  });
};

module.exports.init = async () => {
  await pull();
  if (isUpdated()) await build();
}
