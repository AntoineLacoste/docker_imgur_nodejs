let express       = require('express');
let path          = require('path');
let favicon       = require('serve-favicon');
let logger        = require('morgan');
let cookieParser  = require('cookie-parser');
let bodyParser    = require('body-parser');
let mongoose      = require('mongoose');
let passport      = require('passport');
let localStrategy = require('passport-local').Strategy;

let users         = require('./routes/users');
let images        = require('./routes/images');
let admin         = require('./routes/admin');

let config = require('./config');

if(!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

mongoose.connect(config[process.env.NODE_ENV]);
let db = mongoose.connection;
db.once('open', function () {
  console.log("connected correctly to server");
});

let app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/public', express.static('public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    next();
});

// passport config
let User = require('./model/user');
app.use(passport.initialize());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/api/user', users);
app.use('/api/images', images);
app.use('/api/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
