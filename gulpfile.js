const util = require('util');
const gulp = require('gulp');
const webpack = require('webpack');
const { spawn, exec } = require('child_process');

const { generateSprite } = require('./scripts/svg-to-sprite');
const promiseExec = util.promisify(require('child_process').exec);
const webpackConfig = require('./webpack.config');

function clean(cb) {
  return promiseExec('rm -rf dist', cb);
}

function runWebpack(webpackConfig) {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err || stats.hasErrors()) {
        console.error('err:', err);
        console.log(stats.toString({ 'errors-warnings': true }));

        return resolve();
      }

      console.log(stats.toString({ normal: true, colors: true }));

      resolve();
    });
  });
}

function copyTemplates() {
  return gulp
    .src([
      './clients/templates/layout.html',
      './clients/templates/404.html',
      './clients/templates/500.html',
    ])
    .pipe(gulp.dest('./dist/templates'));
}

function copyStatics() {
  return gulp
    .src('./clients/assets/**/*')
    .pipe(gulp.dest('./dist'));
}

function buildIcons() {
  return generateSprite();
}

function getServerTask(serverName) {
  return gulp.series(
    () => exec(`go build -o ./bin/${serverName} server/cmd/${serverName}/main.go`),
    () => {
      childProcess = spawn(`./bin/${serverName}`, ['-c', 'config.yaml']);
      childProcess.stderr.pipe(process.stderr);
      childProcess.stdout.pipe(process.stdout);
      return childProcess;
    }
  );
}

function webpackWatchTask() {
  return runWebpack(webpackConfig({ mode: 'development' }));
}

const buildAssetsTask = gulp.parallel(copyStatics, copyTemplates, buildIcons);
const serverTask = gulp.parallel(getServerTask('portal'), getServerTask('home'));

exports.webpack = webpackWatchTask;
exports.buildIcons = buildIcons;
exports.buildAssets = buildAssetsTask;
exports.server = serverTask;
exports.client = gulp.parallel(buildAssetsTask, webpackWatchTask);

exports.default = gulp.series(clean, gulp.parallel(buildAssetsTask, serverTask, webpackWatchTask));
