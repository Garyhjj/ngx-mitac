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


const port = process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production' ? 8081 : 8083;
app.listen(port, function () {
  console.log('production on port ' + port);
})
