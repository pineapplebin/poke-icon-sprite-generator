const nodePath = require('path');
const nodeFs = require('fs');
const DATA = require('../pokesprite/pokemon.json');

const DIR = nodePath.join(nodePath.dirname(__dirname), 'pokesprite', 'icons');

const getPath = (name, isFemale = false) => {
  if (isFemale) {
    return nodePath.join(DIR, 'female', `${name}.png`);
  }
  return nodePath.join(DIR, `${name}.png`);
};

const pickFiles = () => {
  const list = Object.keys(DATA)
    .sort()
    .map((key) => DATA[key]);

  const result = {};

  for (const item of list) {
    const forms = Object.entries(item['gen-8'].forms);
    forms.forEach(([key, form]) => {
      const name = `${item.slug.eng}${key === '$' ? '' : `-${key}`}`;
      const hasFemale = form.has_female || false;
      const info = { name, isPure: key === '$' };

      result[getPath(name)] = { ...info };
      if (hasFemale) {
        result[getPath(name, true)] = { ...info, isFemale: true };
      }
    });
  }

  return [result, Object.keys(result).filter((p) => nodeFs.existsSync(p))];
};

module.exports = { pickFiles };
