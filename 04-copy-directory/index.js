const fs = require('fs');
const path = require('path');
const sourceFolder = path.join(__dirname, 'files');
const destFolder = path.join(__dirname, 'files-copy');

function copyDir() {
  fs.mkdir(destFolder, () => {
    fs.readdir(sourceFolder, { withFileTypes: true }, (_, items) => {
      fs.readdir(destFolder, (_, destItems) => {
        destItems.forEach((item) =>
          fs.unlink(path.join(destFolder, item), () => {}),
        );
        items.forEach((item) => {
          if (item.isFile()) {
            fs.copyFile(
              path.join(sourceFolder, item.name),
              path.join(destFolder, item.name),
              () => {},
            );
          }
        });
      });
    });
  });
}

copyDir();
