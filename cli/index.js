const cac = require('cac'),
  createDDc = require('./createDDC');


const cli = cac();

createDDc(cli);

cli.on('error', err => {
  console.error('command failed:', err)
  process.exit(1)
});

cli.parse();

// console.log(process.argv)
