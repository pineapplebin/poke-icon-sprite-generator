const nodePath = require('path');
const nodeFs = require('fs');

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
  const template = `.pokesprite { display: inline-block }\n.pokesprite.pokemon { width: 68px; height: 56px; background-image: url('${FILE_NAME}.png'); image-rendering: pixelated; image-rendering: -moz-crisp-edges }\n`;

  const list = Object.entries(coordinates).map(([path, data]) => {
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
  writeFile(`${FILE_NAME}.png`, sprite.image);
};

module.exports = { generateFile };
