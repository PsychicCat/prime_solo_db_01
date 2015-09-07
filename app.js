var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var localStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var flash = require('connect-flash');
var User = require('./models/user');
var moment = require('moment');

// Mongo setup
var mongoURI = "mongodb://localhost:27017/prime_example_passport";
var MongoDB = mongoose.connect(mongoURI).connection;

MongoDB.on('error', function (err) {
  console.log('mongodb connection error', err);
});

MongoDB.once('open', function () {
  console.log('mongodb connection open');
});

//Initialize routes
var index = require('./routes/index');
var users = require('./routes/users');
var register = require('./routes/register');
var forgot = require('./routes/forgot');
var reset = require('./routes/reset');
var logout = require('./routes/logout');

var app = express();


passport.use('local', new localStrategy({
      passReqToCallback : true,
      usernameField: 'username'
    },
    function(req, username, password, done){
      User.findOne({ username: username }, function(err, user) {
        if (err) throw err;
        //check if user exists
        if (!user)
          return done(null, false, {message: 'Incorrect username or password.'});

        //check if the account is currently locked
        if(user.isLocked) {
          return user.incLoginAttempts(function(err){
            if (err) return done(err);
            return done(null, false, {message: 'Maximum failed login attempts. Your account is locked for ' + moment(user.lockUntil).fromNow('mm') + '.' });
          })
        }

        // test a matching password
        user.comparePassword(password, function(err, isMatch) {
          if (err) throw err;
          //check if password matches
          if(isMatch){
            //if no lock or failed attempts, return the user
            if(!user.loginAttempts && !user.lockUntil) return done(null, user);
            //reset attempts and lock info
            var updates = {
              $set: { loginAttempts: 0 },
              $unset: { lockUntil: 1 }
            };
            return user.update(updates, function(err){
              if (err) return done(err);
              return done(null, user);
            });
          } else {
            //increment failed login attempts counter
            user.incLoginAttempts(function(){
              if(err) return done(err);
            });
            done(null, false, { message: 'Incorrect username or password.' });
          }
        });
      });
    }
));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/vendors', express.static(path.join(__dirname, './node_modules')));
app.use(session({
  secret: 'secret',
  key: 'user',
  resave: true,
  saveUninitialized: false,
  cookie: {maxAge: 60000, secure:false}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err,user){
    if(err) done(err);
    done(null,user);
  });
});


app.use('/', index);
app.use('/users', users);
app.use('/register', register);
app.use('/forgot', forgot);
app.use('/logout', logout);
app.use('/reset', reset);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
