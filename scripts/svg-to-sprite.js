const util = require('util');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const svgSpreact = require('svg-spreact');
// const SVGSpriter = require('svg-sprite');
const mkdirp = require('mkdirp');
const svgoConfig = require('./svgo.config');
const { type } = require('os');

function getFileContent(filePath) {
  return util.promisify(fs.readFile)(filePath, { encoding: 'utf-8' });
}

function getFileNames() {
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

function getIconNames() {
  return getFileContent(
    path.join(__dirname, '../clients/portal/components/icon/names.ts')
  ).then((data) => {
    const names = data
      .split('\n')
      .slice(1, -2)
      .map((str) => {
        const [name] = /[a-z\_]+/.exec(str);
        return name;
      })
      .filter(Boolean);
    return names;
  });
}

function getSVGFiles() {
  return Promise.all([getFileNames(), getIconNames()]).then(
    ([fileNames, iconNames]) => {
      return fileNames.filter((fileName) => {
        return iconNames.some((iconName) => {
          return fileName.endsWith(`${iconName}.svg`);
        });
      });
    }
  );
}

module.exports = function () {
  return getSVGFiles().then((filePaths) => {
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
