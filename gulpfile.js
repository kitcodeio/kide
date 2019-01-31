const gulp = require('gulp');
const { exec } = require('child_process');

const minify = require('gulp-minify');

function run(cmd) {
  return new Promise(resolve => {
    exec(cmd, () => resolve());
  });
}

gulp.task('build', async function() {
  await run('npm run build -- --prod');
  await run('./scripts/build');
  gulp.src(['serverDaemon.d/daemon.js'])
    .pipe(minify())
    .pipe(gulp.dest('serverDaemon.d/'))
});
