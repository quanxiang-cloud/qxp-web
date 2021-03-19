const util = require('util');
const gulp = require('gulp');
const webpack = require('webpack');

const promiseExec = util.promisify(require('child_process').exec);
const { spawn } = require('child_process');

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

function getWebpackConfig(config) {
  Object.keys(require.cache).forEach(function (key) {
    delete require.cache[key];
  });
  return require('./webpack.config.js')(config);
}

exports.build = gulp.series(clean, copyImages, copyTemplates,
  (done) => {
    runWebpack(getWebpackConfig({ mode: 'production' })).then(done);
  },
  (done) => {
    return promiseExec('rm -rf docker-files/nginx/dist docker-files/portal/dist', done);
  },
  () => gulp.src('./dist/**/*').pipe(gulp.dest('./docker-files/nginx/dist')),
  () => gulp.src('./dist/templates/*').pipe(gulp.dest('./docker-files/portal/dist/templates')),
);

exports.default = gulp.series(clean, copyTemplates, copyImages, () => {
  gulp.watch(['./webpack.config.js'], { ignoreInitial: false }, gulp.series((done) => {
    runWebpack(getWebpackConfig({ mode: 'development' })).then(done);
  }));

  portalServer = spawn('air');
  portalServer.stderr.pipe(process.stderr);
  portalServer.stdout.pipe(process.stdout);
});
