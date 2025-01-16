const fs = require('fs');
const path = require('path');
const secretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolder, { withFileTypes: true }, (_, files) => {
  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(secretFolder, file.name);
      const { name, ext } = path.parse(file.name);

      fs.stat(filePath, (_, stats) => {
        console.log(
          `${name} - ${ext.slice(1)} - ${(stats.size / 1024).toFixed(3)}kb`,
        );
      });
    }
  });
});
