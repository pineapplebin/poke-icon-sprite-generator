const { pickFiles } = require('./file-picker');
const { runSpritesmith } = require('./spritesmith');
const { generateFile } = require('./result');

const generator = async () => {
  const [infos, files] = pickFiles();
  const sprite = await runSpritesmith(files);
  generateFile(infos, sprite);
};

generator();
