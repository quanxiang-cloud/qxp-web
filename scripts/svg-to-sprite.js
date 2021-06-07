const util = require('util');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const svgSpreact = require('svg-spreact');
const svgoConfig = require('./svgo.config');
const basePath = process.cwd();
const mkdirp = require('mkdirp');

function getFileContent(filePath) {
  return util.promisify(fs.readFile)(filePath, { encoding: 'utf-8' });
}

function getFileNames() {
  return new Promise((resolve, reject) => {
    glob(
      path.join(basePath, './clients/components/icon/svgs/**/*.svg'),
      (err, files) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(files.filter((f) => f.endsWith('.svg')));
      }
    );
  });
}

function getAllSvgContent() {
  return getFileNames().then((files) => {
    return Promise.all(files.map((f) => getFileContent(f)))
      .then((conts) => conts.map((cont, idx) => {
        return {
          file: files[idx],
          cont,
        };
      }));
  });
}

function getSprite(cb) {
  return getAllSvgContent().then((svgArr) => {
    const iconNames = svgArr.map(({ file }) =>
      path.basename(file).replace('.svg', '')
    );
    const iconID = (n) => iconNames[n];
    svgSpreact(svgArr.map((v) => v.cont), { tidy: true, processId: iconID, svgoConfig }).then(
      ({ defs }) => {
        // replace #475569 by currentColor in order to be styled by css
        // todo define #475569 as constant?
        const svgStr = defs
          .replace(/currentColor/g, 'none')
          .replace(/#475569/g, 'currentColor');

        return typeof cb === 'function' ? cb(svgStr) : svgStr;
      }
    ).catch(console.error);
  });
}

function generateHash(value) {
  const cryptoCreate = crypto.createHash('md5');
  cryptoCreate.update(value);
  const hash = cryptoCreate.digest('hex');
  return hash;
}

const generateSprite = function () {
  return getSprite(function (svgStr) {
    const hash = generateHash(svgStr);
    const pathName = `/dist/images/sprite-${hash}.svg`;
    const spriteFileName = `export default '${pathName}';
`;
    const spriteFile = path.join(basePath, pathName);
    const variableFile = path.join(basePath, '/clients/components/icon/svg-hash.ts');
    mkdirp.sync(path.dirname(spriteFile));
    fs.writeFileSync(variableFile, spriteFileName);
    fs.writeFileSync(spriteFile, svgStr);
  });
};

module.exports = {
  getSprite,
  generateSprite,
};
