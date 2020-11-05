var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard');
var addNewCategoryRouter = require('./routes/addNewCategory');
var passwordCategoryRouter = require('./routes/passwordCategory');
var addNewPasswordRouter = require('./routes/addNewPassword');
var viewAllPasswordRouter = require('./routes/viewAllPassword');
var password_detailRouter = require('./routes/password_detail');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: '>fqdN3$4B-QLmk#d',
  resave: false,
  saveUninitialized: true,
}))

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/addNewCategory', addNewCategoryRouter);
app.use('/passwordCategory', passwordCategoryRouter);
app.use('/addNewPassword', addNewPasswordRouter);
app.use('/viewAllPassword', viewAllPasswordRouter); 
app.use('/password_detail', password_detailRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
