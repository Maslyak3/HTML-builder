const fs = require('fs');
const readableStream = fs.createReadStream('text.txt');
let data = '';
readableStream.on('data', (chunk) => console.log(chunk.length));
stream.on('end', () => console.log('End', data.length));
