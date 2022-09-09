const nodePath = require('path');
const nodeFs = require('fs');
const { fileUpload } = require('./tiny-png');

const DIR = nodePath.join(nodePath.dirname(__dirname), 'output');

const prepareOutputDir = () => {
  if (!nodeFs.existsSync(DIR)) {
    nodeFs.mkdirSync(DIR);
  }
};

const FILE_NAME = 'pokemon-icon';

const writeFile = (name, data) => {
  nodeFs.writeFileSync(nodePath.join(DIR, name), data);
};

const generateCSS = (infos, coordinates) => {
  const template = `.pokesprite { display: inline-block }\n.pokesprite.pokemon { width: 68px; height: 56px; background-image: url('${FILE_NAME}.min.png'); image-rendering: pixelated; image-rendering: -moz-crisp-edges }\n`;

  const list = Object.entries(coordinates)
    .sort((a, b) => {
      if (infos[a[0]].isPure) return -1;
      if (infos[b[0]].isPure) return 1;
      return 0;
    })
    .map(([path, data]) => {
      const info = infos[path];
      return `.pokesprite.${info.name}${
        info.isFemale ? '.female' : ''
      } { background-position: -${data.x}px -${data.y}px }`;
    });

  writeFile(`${FILE_NAME}.css`, template + list.join('\n'));
};

const generateFile = (infos, sprite) => {
  prepareOutputDir();
  generateCSS(infos, sprite.coordinates);

  // 保存一份压缩的 一份原图
  writeFile(FILE_NAME + '.png', sprite.image);
  writeFile(FILE_NAME + '.min.png', sprite.image);

  return fileUpload(nodePath.join(DIR, FILE_NAME + '.min.png'));
};

module.exports = { generateFile };
