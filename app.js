var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var db = require('./api/utils/databaseHelper')
var app = express();
var indexRouter = require('./routes/index');
require('dotenv').config()
var server = require('http').Server(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(function (req, res, next) {
  // Website you wish to allow to connect    
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow    
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow    
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization,language,auth_token');
  // Set to true if you need the website to include cookies in the requests sent    
  // to the API (e.g. in case you use sessions)    
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware    
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(__dirname + '/Images'));
app.use('/views', express.static(__dirname + '/views'));

app.use('/', indexRouter);
app.use('/assets', express.static('assets'))

app.use('/admin', require('./api/v1/adminRoutes'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



db.connect().then((db) => {
  if (db.code == 0) {
    console.log("Mongodb connection error...");
  } else {
    server.listen(process.env.PORT, function (err) {
      if (err) {
        console.log(err);
        console.log("Error to listen on port...");
      } else {
        console.log('MongoDB Connected !')
        console.log(`App is running on ${process.env.PORT} port...`);
      }
    });
  }
});



module.exports = app;
