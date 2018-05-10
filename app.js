var express           = require('express');
var path 			        = require('path');
var favicon 		      = require('serve-favicon');
var logger 			      = require('morgan');
var cookieParser 	    = require('cookie-parser');
var bodyParser 		    = require('body-parser');
var expressHbs        = require('express-handlebars');
var mongoose          = require('mongoose');
var session			      = require('express-session');
var passport		      = require('passport');
var flash  			      = require('connect-flash');
var validator         = require('express-validator');
var MongoStroe        = require('connect-mongo')(session);
var app 			        = express();

var employees         = require('./routes/employees');
var companyOwner      = require('./routes/companyOwner');
var index 			      = require('./routes/index');



//Import the database configuration file
require('./config/database');

//Import The configuration file of the project
require('./config/passport');

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'hbs');
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: true,
  store: new MongoStroe({ mongooseConnection: mongoose.connection}),
  cookie: { maxAge: 18000 * 6000 * 100000}
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = res.session;
  next();
});

app.use('/employees',employees);
app.use('/companyOwner', companyOwner);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
