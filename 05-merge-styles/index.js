const fs = require('fs');
const path = require('path');
const stylesFolder = path.join(__dirname, 'styles');
const outputFolder = path.join(__dirname, 'project-dist');
const bundleFile = path.join(outputFolder, 'bundle.css');
function mergeStyles() {
  fs.mkdir(outputFolder, { recursive: true }, () => {
    const output = fs.createWriteStream(bundleFile);
    fs.readdir(stylesFolder, { withFileTypes: true }, (_, files) => {
      files.forEach((file) => {
        const filePath = path.join(stylesFolder, file.name);

        if (file.isFile() && path.extname(file.name) === '.css') {
          const readable = fs.createReadStream(filePath, 'utf-8');
          readable.pipe(output, { end: false });
          readable.on('end', () => output.write('\n'));
        }
      });
    });
  });
}

mergeStyles();
