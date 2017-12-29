var express = require('express');
var fs = require('fs');
var path = require('path');
var app = express();

app.use(express.static('dist'));

app.use(function (req, res, next) {
  fs.readFile(path.join(__dirname, 'dist/index.html'), function (err, data) {
    res.end(data);
  })
})



app.listen(2345, function () {
  console.log('production on port 2345')
})
