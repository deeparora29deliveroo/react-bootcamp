const fs = require('fs');
const path = require('path');

const importRegex = RegExp(
  /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?(["'\s].*([@\w_-]+)["'\s]).*;$/,
  'gm',
);
const exportRegex = RegExp(/export default/);

const findFilesInDir = (startPath, filter) => {
  let results = [];

  if (!fs.existsSync(startPath)) {
    // eslint-disable-next-line no-console
    throw new Error(`Could not find directory: ${startPath}`);
  }

  const files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      results = results.concat(findFilesInDir(filename, filter)); // recurse
    } else if (filename.indexOf(filter) >= 0) {
      results.push(filename);
    }
  }
  return results;
};

const tsFiles = findFilesInDir('./app/server', '.ts');

tsFiles.forEach((file) => {
  // eslint-disable-next-line no-console
  console.log(`Converting import syntax for ${file}...`);
  let fileContents = fs.readFileSync(file).toString();
  const matches = fileContents.matchAll(importRegex);

  for (const match of matches) {
    if (match[1] !== undefined) {
      fileContents = fileContents.replace(
        new RegExp(match[0]),
        match[1].includes('type ') ? '' : `const ${match[1]}= require(${match[2]})`,
      );
    }
    fileContents = fileContents.replace(exportRegex, 'module.exports =');
  }
  fs.writeFileSync(file, fileContents);
});
