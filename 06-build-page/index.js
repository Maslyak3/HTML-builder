const fs = require('fs');
const path = require('path');
const projectDist = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsFolder = path.join(__dirname, 'components');
const stylesFolder = path.join(__dirname, 'styles');
const assetsFolder = path.join(__dirname, 'assets');
const outputAssetsFolder = path.join(projectDist, 'assets');
fs.mkdir(projectDist, { recursive: true }, () => {
  fs.readFile(templatePath, 'utf-8', (err, templateData) => {
    if (err) throw err;
    const templateTags = templateData.match(/{{\w+}}/g) || [];
    let processedTemplate = templateData;
    let pendingReplacements = templateTags.length;
    templateTags.forEach((tag) => {
      const componentName = tag.replace(/{{|}}/g, '');
      const componentPath = path.join(
        componentsFolder,
        `${componentName}.html`,
      );
      fs.readFile(componentPath, 'utf-8', (err, componentData) => {
        if (!err) {
          processedTemplate = processedTemplate.replace(
            new RegExp(tag, 'g'),
            componentData,
          );
        }
        pendingReplacements--;
        if (pendingReplacements === 0) {
          fs.writeFile(
            path.join(projectDist, 'index.html'),
            processedTemplate,
            () => {},
          );
        }
      });
    });
  });
  const styleOutput = fs.createWriteStream(path.join(projectDist, 'style.css'));
  fs.readdir(stylesFolder, { withFileTypes: true }, (_, files) => {
    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesFolder, file.name);
        const readable = fs.createReadStream(filePath, 'utf-8');
        readable.pipe(styleOutput, { end: false });
        readable.on('end', () => styleOutput.write('\n'));
      }
    });
  });
  function copyAssets(src, dest) {
    fs.mkdir(dest, { recursive: true }, () => {
      fs.readdir(src, { withFileTypes: true }, (_, items) => {
        items.forEach((item) => {
          const srcPath = path.join(src, item.name);
          const destPath = path.join(dest, item.name);

          if (item.isFile()) {
            fs.copyFile(srcPath, destPath, () => {});
          } else if (item.isDirectory()) {
            copyAssets(srcPath, destPath);
          }
        });
      });
    });
  }
  copyAssets(assetsFolder, outputAssetsFolder);
});
