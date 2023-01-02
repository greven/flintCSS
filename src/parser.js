const { readdir, readFile, writeFile } = require('fs')
const path = require('path')
const postcss = require('postcss')
const postcssJs = require('postcss-js')
const chokidar = require('chokidar')

const DIST_DIR = process.argv[2]
const options = process.argv[3]

if (options === '--watch') {
  watchFiles(DIST_DIR)
} else {
  processDirectory(DIST_DIR)
}

// Convert all CSS files to JSS in the target directory
function processDirectory(directory) {
  readdir(directory, (err, files) => {
    if (err) {
      console.error(err)
      return
    }

    files
      .filter((file) => path.extname(file).toLowerCase() === '.css')
      .forEach((file) => convertToJSS(path.join(DIST_DIR, file)))
  })
}

function watchFiles(directory) {
  const watcher = chokidar.watch(`${directory}/*.css`, {
    usePolling: true,
    interval: 100,
    awaitWriteFinish: {
      stabilityThreshold: 50,
      pollInterval: 10,
    },
  })

  watcher
    .on('add', (path) => convertToJSS(path))
    .on('change', (path) => convertToJSS(path))
    .on('unlink', (path) => console.log(`Parser: File ${path} has been removed`))
}

function convertToJSS(filepath) {
  readFile(filepath, 'utf8', (err, styles) => {
    if (err) {
      console.error(err)
      return
    }

    const css = postcss.parse(styles)
    const jss = postcssJs.objectify(css)
    const output = path.join(DIST_DIR, path.parse(filepath).name + '.json')
    writeJsonFile(output, jss)
  })
}

function writeJsonFile(destFilename, styles) {
  writeFile(destFilename, JSON.stringify(styles), (err) => {
    if (err) throw err
  })
}
