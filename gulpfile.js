const util = require('util');
const gulp = require('gulp');
const webpack = require('webpack');
const getWebpackConfig = require('./webpack.config.js');

const promiseExec = util.promisify(require('child_process').exec);
const { spawn, exec } = require('child_process');

function clean(cb) {
  return promiseExec('rm -rf dist', cb);
}

function runWebpack(webpackConfig) {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      console.log(stats.toString({ colors: true }));

      if (err || stats.hasErrors()) {
        console.error('webpack bundle error');
        return reject();
      }

      resolve();
    });
  });
}

function copyTemplates() {
  return gulp.src('./clients/templates/layout.html').pipe(gulp.dest('./dist/templates'));
}

function copyImages() {
  return gulp.src('./clients/assets/images/**/*').pipe(gulp.dest('./dist/images'));
}

let portalServer = null;

function buildPortalServer() {
  return spawn('go', ['build', '-o', './bin/portal', 'server/cmd/portal/main.go']);
}

function startPortalServer(done) {
  if (portalServer && portalServer !== null) {
    portalServer.kill();
  }

  portalServer = spawn('./bin/portal', ['-c', './config.yaml']);
  portalServer.stderr.on('data', function (data) {
    process.stdout.write(data.toString());
  });

  portalServer.stdout.on('data', function (data) {
    process.stdout.write(data.toString());
  });

  done();
}

exports.default = gulp.series(clean, copyTemplates, copyImages, () => {
  runWebpack(getWebpackConfig({ mode: 'development' }));

  gulp.watch(['server/**/*.go'], { ignoreInitial: false }, gulp.parallel(
    gulp.series(buildPortalServer, startPortalServer),
  ));
})

exports.build = gulp.series(clean, gulp.parallel(copyImages, copyTemplates,
  (done) => runWebpack(getWebpackConfig({ mode: 'production' })).then(done),
  (done) => {
    exec('GOOS=linux GOARCH=amd64 go build -o ./bin/portal server/cmd/portal/main.go', (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }

      done();
    })
  },
));
