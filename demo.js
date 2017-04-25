var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var parser = bodyParser.urlencoded({extended: false});

app.use('/', parser, function(req, res, next) {
  console.log('Coucou middle');
  next();
});

app.get('/', function(req, res) {
  res.end('hello');
});

app.listen(1337);