var fs = require('fs');

module.exports.loadData = function(file, cb) {
  fs.readFile(__dirname + '/../data/' + file, 'utf8', cb);
};
