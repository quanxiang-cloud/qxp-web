const util = require('util');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const svgSpreact = require('svg-spreact');
// const SVGSpriter = require('svg-sprite');
const mkdirp = require('mkdirp');
const svgoConfig = require('./svgo.config');

function getFileContent(filePath) {
  return util.promisify(fs.readFile)(filePath, { encoding: 'utf-8' });
}

function getFileNames() {
  return new Promise((resolve, reject) => {
    glob(
      path.join(__dirname, '../clients/common/components/icon/svgs/*.svg'),
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
    path.join(__dirname, '../clients/common/components/icon/names.ts')
  ).then((data) => {
    // const names = data
    //   .substring(data.indexOf('[') + 2, data.indexOf(']') - 1)
    //   .trim()
    //   .split("', '");
    // return names;
    const names = data
      .split('\n')
      .slice(1, -2)
      .map((str) => {
        const [name] = /[a-z\-]+/.exec(str);
        return name;
      })
      .filter(Boolean);
    console.log(names);
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

//往固定的行写入数据
function writeSvgTmpToLayout(value) {
  let basePath = path.resolve('./');
  let data = fs
    .readFileSync(basePath + '/dist/templates/layout.html', 'utf8')
    .split(/\r\n|\n|\r/gm); //readFileSync的第一个参数是文件名
  const index = data.indexOf('  <body>');
  data.splice(index + 1, 0, value);
  fs.writeFileSync(basePath + '/dist/templates/layout.html', data.join('\r\n'));
}

module.exports = function () {
  // function build() {
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
          const template = `    {{block "svg-sprite" .}}${svgStr}{{end}}`;
          writeSvgTmpToLayout(template);
        }
      );
    });
  });
};

// build();
