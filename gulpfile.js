const gulp = require('gulp');
const exec = require('child_process').exec;
const Docker = require('dockerode');
const progress = require('cli-progress');
const CLI = require('clui');
const tar = require('tar-fs');
const path = require('path');
const config = require('./config/config.json');

const docker = new Docker();
const Spinner = CLI.Spinner;

function run(cmd) {
  return new Promise(resolve => {
    exec(cmd, () => resolve());
  });
}

function pull() {
  return new Promise(done => {
    docker.pull('ubuntu:latest', (err, stream) => {
      if (err) return done(err);
      console.log('local ubuntu image not found');
      console.log('pull ubuntu:latest from docker hub');
      const bar = new progress.Bar();
      let value = 0;
      bar.start(135, value);
      docker.modem.followProgress(stream, (err) => {
        bar.update(135);
        bar.stop();
        if (!err) return done();
      }, () => {
        bar.update(++value);
      });
    });
  });
}

function install() {
  return new Promise(async done => {
    let stream = await docker.buildImage({
      context: path.join(__dirname, 'dockerfiles'),
      src: ['Dockerfile']
    }, {
      t: config.docker.baseImageName
    });
    const countdown = new Spinner('starting', ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);
    countdown.start();
    docker.modem.followProgress(stream, () => {
      process.stdout.write('\n');
      countdown.stop();
      done();
    }, (evt) => {
      if(evt.stream && evt.stream !== '\n') countdown.message(evt.stream.replace('\n', ''));
    });
  });
}

gulp.task('build', async function() {
  await run('npm run build -- --prod');
  await run('./scripts/build');
  await run('mkdir serverDaemon.d/node_modules/socket.io-client && mkdir serverDaemon.d/node_modules/socket.io-client/dist');
  await run('cp -r node_modules/socket.io-client/dist/socket.io.js* serverDaemon.d/node_modules/socket.io-client/dist/');
});

gulp.task('start-kide', async function(done) {
  let image = await docker.getImage('ubuntu').inspect().catch(() => {});
  if (!image) await pull();
  let nginx = await docker.getImage('ubuntu-nginx').inspect().catch(() => {});
  if (!nginx) await install();
  let container = await docker.createContainer({
    Image: 'ubuntu-nginx',
    Cmd: ['/bin/bash', 'serverDaemon.d/kide']
  });

  console.log('packing kide');
  let pack = tar.pack('.', {
    entries: ['serverDaemon.d']
  });

  console.log('copying kide');
  await container.putArchive(pack, {
    path: '/'
  });

  await container.start();
  let info = await container.inspect();

  console.log('open this link http://' + info.NetworkSettings.IPAddress + ':54123/'); 
  return done();
});

