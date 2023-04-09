/* eslint-disable no-param-reassign, no-console */
const fs = require('fs');

const jestJson = require('../jest/config.json');
const eslintJson = require('../.eslintrc.json');
const packageJson = require('../package.json');

// eslint-disable-next-line import/no-dynamic-require
const changes = require(`./choose${process.argv[2]}ConfigChanges.json`);

const cdtJs = fs.readFileSync('cdt.config.js').toString();

const FILES_TO_CHANGE = {
  jestJson,
  eslintJson,
  packageJson,
  cdtJs,
};

const FILE_LOCATIONS = {
  jestJson: './jest/config.json',
  eslintJson: './.eslintrc.json',
  packageJson: './package.json',
  cdtJs: './cdt.config.js',
};

const createCopy = (input) => JSON.parse(JSON.stringify(input));

const getProperty = (property, input) => {
  const split = property.split('.');
  let selected = input;
  split.slice(0, -1).forEach((splitProp) => {
    selected = selected[splitProp];
  });
  return { selected, lastBit: split[split.length - 1] };
};

const removeProperties = (properties, input) => {
  properties.forEach((property) => {
    const { selected, lastBit } = getProperty(property, input);
    delete selected[lastBit];
  });
  return input;
};

const changeProperties = (properties, input) => {
  Object.keys(properties).forEach((property) => {
    const { selected, lastBit } = getProperty(property, input);
    selected[lastBit] = properties[property];
  });
  return input;
};

const removeFromArray = (properties, input) => {
  Object.keys(properties).forEach((property) => {
    const { selected, lastBit } = getProperty(property, input);
    selected[lastBit] = selected[lastBit].filter((item) => !properties[property].includes(item));
  });
  return input;
};

const findAndReplace = (targets, input) => {
  const isString = typeof input === 'string';
  let stringInput = isString ? input : JSON.stringify(input);
  Object.keys(targets).forEach((key) => {
    stringInput = stringInput.replace(new RegExp(key, 'g'), targets[key]);
  });
  return isString ? stringInput : JSON.parse(stringInput);
};

const addProperties = (properties, input, filesToChangeLocation) => {
  const keysToAdd = Object.keys(properties);
  const existingKeys = Object.keys(input);
  const duplicateKeys = keysToAdd.filter((value) => existingKeys.includes(value));

  if (duplicateKeys.length > 0) {
    const err = new Error(
      `Your configuration of ${filesToChangeLocation} will overwriting existing keys. If you're modifying existing keys, you should use "changeProperties" or "findAndReplace"`,
    );

    err.info = JSON.stringify({
      affectedFiles: filesToChangeLocation,
      affectedKeys: duplicateKeys,
    });

    throw err;
  }

  return {
    ...input,
    ...properties,
  };
};

// modify required config files
Object.keys(changes).forEach((key) => {
  console.log(`Changing config for ${key}...`);
  const isJson = key.includes('Json');
  let copy = isJson ? createCopy(FILES_TO_CHANGE[key]) : FILES_TO_CHANGE[key];
  Object.keys(changes[key]).forEach((operation) => {
    const operationValue = changes[key][operation];
    switch (operation) {
      case 'removeProperties':
        copy = removeProperties(operationValue, copy);
        break;
      case 'changeProperties':
        copy = changeProperties(operationValue, copy);
        break;
      case 'removeFromArray':
        copy = removeFromArray(operationValue, copy);
        break;
      case 'findAndReplace':
        copy = findAndReplace(operationValue, copy);
        break;
      case 'addProperties':
        copy = addProperties(operationValue, copy, FILE_LOCATIONS[key]);
        break;
      default:
        throw Error(`Unrecognised change for ${key}: ${operation}`);
    }
  });
  console.log(`Writing ${key}...`);
  fs.writeFileSync(FILE_LOCATIONS[key], isJson ? JSON.stringify(copy, null, 2) : copy);
});
