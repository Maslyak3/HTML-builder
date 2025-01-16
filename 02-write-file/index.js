const fs = require('fs');
const path = require('path');
const readline = require('readline');
const filePath = path.join(__dirname, 'output.txt');
const writableStream = fs.createWriteStream(filePath, { flags: 'a' });
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
console.log('Enter your text below. Type "exit" or press Ctrl+C to quit.');
rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    exit();
  } else {
    writableStream.write(input + '\n', (err) => {
      if (err) console.error('Error writing to file:', err);
    });
  }
});
rl.on('SIGINT', exit);

function exit() {
  console.log('Goodbye!');
  writableStream.end();
  rl.close();
  process.exit();
}
