const fs = require('fs'),
  path = require('path'),
  template = require('./template');


module.exports = (cli) => {
  const defaultCommand = cli.command('createDDC', {
    desc: '新建有app-data-drive的组件'
  }, (input, flags) => {
    const filePath = './test.html';
    fs.writeFile(filePath, template.getHTML(flags), (err) => {
      if (err) {
        console.error('command failed:', err);
      } else {
        console.log('Finished:', filePath);
      }
    })
    if (flags.name) {
      console.log(flags.name)
      console.log(888)
    }
  });

  defaultCommand.option('name', {
    desc: 'tell me the table name'
  });

  defaultCommand.option('subPath', {
    desc: 'tell me what sub-path you want to put the file'
  });

}
