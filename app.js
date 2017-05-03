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
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    next();
});

app.use(multer({
    dest: DIR,
    rename: function (fieldname, filename) {
        console.log(filename);
        // crypto.pseudoRandomBytes(16, function (err, raw) {
        //     cb(err, raw.toString('hex') + '.' + mime.extension(file.mimetype));
        // });
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...');
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path);
    }
}));

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

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
