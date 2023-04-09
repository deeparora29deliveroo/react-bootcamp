/* eslint-disable no-console */
const execa = require('execa');
// eslint-disable-next-line import/no-dynamic-require
const depsToRemove = require(`./choose${process.argv[2]}DepsToRemove.json`);

const removeDeps = async () => {
  try {
    console.log('Removing dependencies...');
    const deps = [...depsToRemove.deps, ...depsToRemove.devDeps];
    if (deps.length > 0) {
      const { stdout } = await execa('yarn', ['remove', ...deps]);
      console.log(stdout);
    } else {
      console.log('No dependencies to remove, skipping');
    }
  } catch (err) {
    console.error(err);
  }
};
removeDeps();
