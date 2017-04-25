var express    = require('express');
var app        = express();

global.comments = [];

app.engine('.html', require('ejs').__express);

app.set('view engine', 'html');

app.use('/public', express.static(__dirname + '/public'));

app.use('/', require('./controllers'));

app.listen(1337, function() {
  console.log('App running');
});