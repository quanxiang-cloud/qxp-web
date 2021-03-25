const util = require('util');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const svgSpreact = require('svg-spreact');
const mkdirp = require('mkdirp');
const svgoConfig = require('./svgo.config');

function getFileContent(filePath) {
  return util.promisify(fs.readFile)(filePath, { encoding: 'utf-8' });
}

function getFileFullPath() {
  return new Promise((resolve, reject) => {
    glob(
      path.join(__dirname, '../clients/portal/components/icon/svgs/*.svg'),
      (err, files) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(files);
      }
    );
  });
}

module.exports = function () {
  return getFileFullPath().then((filePaths) => {
    return Promise.all(
      filePaths.map((filePath) => {
        return getFileContent(filePath);
      })
    ).then((svgStrArr) => {
      const iconNames = filePaths.map((filePath) =>
        path.basename(filePath).replace('.svg', '')
      );
      const iconID = (n) => iconNames[n];
      svgSpreact(svgStrArr, { tidy: true, processId: iconID, svgoConfig }).then(
        ({ defs, refs }) => {
          // replace #475569 by currentColor in order to be styled by css
          // todo define #475569 as constant?
          const svgStr = defs.replace(/#475569/g, 'currentColor');
          mkdirp.sync(
            path.dirname(path.join(__dirname, '../dist/images/sprite.svg'))
          );
          fs.writeFileSync(
            path.join(__dirname, '../dist/images/sprite.svg'),
            svgStr
          );
        }
      );
    });
  });
};
