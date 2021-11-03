import util from 'util';
import gulp from 'gulp';
import { spawn, exec } from 'child_process';

import { generateSprite } from './scripts/svg-to-sprite';

const promiseExec = util.promisify(exec);

function clean(cb) {
  return promiseExec('rm -rf dist', cb);
}

function copyTemplates() {
  return gulp
    .src('./clients/templates/*')
    .pipe(gulp.dest('./dist/templates'));
}

function copyStatics() {
  return gulp
    .src('./clients/assets/**/*')
    .pipe(gulp.dest('./dist'));
}

export function buildIcons() {
  return generateSprite();
}

function getServerTask(serverName) {
  return gulp.series(
    () => exec(`go build -o ./bin/${serverName} server/cmd/${serverName}/main.go`),
    () => {
      const childProcess = spawn(`./bin/${serverName}`, ['-c', 'config.yaml']);
      childProcess.stderr.pipe(process.stderr);
      childProcess.stdout.pipe(process.stdout);
      return childProcess;
    },
  );
}

export function rollupWatch() {
  const childProcess = spawn('./node_modules/.bin/rollup', ['-c', 'rollup.config.js', '-w']);
  childProcess.stderr.pipe(process.stderr);
  childProcess.stdout.pipe(process.stdout);
  return childProcess;
}

const buildAssetsTask = gulp.parallel(copyStatics, copyTemplates, buildIcons);
const serverTask = gulp.parallel(getServerTask('portal'), getServerTask('home'));


export const buildAssets = buildAssetsTask;
export const client = gulp.parallel(buildAssetsTask, rollupWatch);
export const server = serverTask;

export default gulp.series(clean, gulp.parallel(buildAssetsTask, serverTask));
