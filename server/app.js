require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var allowedOrigins = require('./util/cors')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// --- global middleware ---

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: allowedOrigins,
}))

console.log(allowedOrigins)

// --- routes ---

app.get('/api/test', (req, res) => {
  return res.status(200).json({message: "hello from the server"})
})

app.use(express.static(path.join(__dirname, '../client/dist')));

// --- error handling ---

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
