var express = require('express');
var compression = require('compression')
var fs = require('fs');
var path = require('path');
var app = express();

app.use(compression());
app.use(express.static('dist'));

app.use(function (req, res, next) {
  fs.readFile(path.join(__dirname, 'dist/index.html'), function (err, data) {
    res.end(data);
  })
})



app.listen(8080, function () {
  console.log('production on port 8080')
})
