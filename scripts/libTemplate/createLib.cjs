const { resolve, join } = require('path');
const yargs = require('yargs/yargs');
const { readdir, readFile, outputFile, pathExistsSync } = require('fs-extra');

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const DEMO_STRING = 'demo';
const DEMO_STRING_PL = 'demos';
const DEMO_STRING_UC = capitalize(DEMO_STRING);
const DEMO_STRING_PL_UC = capitalize(DEMO_STRING_PL);
const DEMO_DIRECTORY_NAME = '/demos';

const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv;
const { o: libName, s: separateSingular } = argv;

if(!libName || typeof libName !== 'string') {
  console.error("\x1b[31m", 'Need to give collection name! "-o [libName]"');
  console.error("\x1b[0m");
  return;
}

const PATH_TO_LIB = join(__dirname, '../../src/lib', libName);

if(pathExistsSync(PATH_TO_LIB)) {
  console.error("\x1b[31m", 'Path Exists already, Please try another!');
  console.error("\x1b[0m");
  return;
}

let singularLibName = libName;

if(separateSingular) {
  singularLibName = separateSingular;
} else if(singularLibName.endsWith("ses")) {
  singularLibName = singularLibName.slice(0, -2)
} else if(singularLibName.endsWith("s")) {
  singularLibName = singularLibName.slice(0, -1)
}
const capitalizedPlural = capitalize(libName);
const capitalizedSingular = capitalize(singularLibName);

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

(async () => {
  for await (const filePath of getFiles(__dirname + DEMO_DIRECTORY_NAME)) {
    let fileData = await readFile(filePath, 'utf8');

    const regexUC = new RegExp(DEMO_STRING_UC,"g");
    const regexLC = new RegExp(DEMO_STRING,"g");
    const regexPL_UC = new RegExp(DEMO_STRING_PL_UC,"g");
    const regexPL_LC = new RegExp(DEMO_STRING_PL,"g");

    fileData = fileData.replace(regexPL_UC, capitalizedPlural);
    fileData = fileData.replace(regexPL_LC, libName);
    fileData = fileData.replace(regexUC, capitalizedSingular);
    fileData = fileData.replace(regexLC, singularLibName);

    const newFilePath = filePath.split('libTemplate/demos/').pop();
    let formattedFilePath = newFilePath.replace(regexPL_UC, capitalizedPlural);
    formattedFilePath = formattedFilePath.replace(regexPL_LC, libName);
    formattedFilePath = formattedFilePath.replace(regexUC, capitalizedSingular);
    formattedFilePath = formattedFilePath.replace(regexLC, singularLibName);

    const pathToStore = join(PATH_TO_LIB, formattedFilePath);

    await outputFile(pathToStore, fileData);
  }

  console.log('\x1b[32m');
  console.log('New lib service was created successfully!');
  console.log(PATH_TO_LIB);
  console.log('\x1b[0m');
})()
