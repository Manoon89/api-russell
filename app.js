const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');

const indexRouter = require('./src/routes/index');
const authRouter = require('./src/routes/auth');

const mongodb = require('./db/mongo');

const swaggerDocs = require('./config/swagger');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongodb.initClientDbConnection();

app.use(cors({
  exposedHeaders: ['Authorization'],
  origin: '*'
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/auth', authRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
console.log('Swagger UI disponible sur http://localhost:8080/api-docs');

app.use(function(req, res, next){
  res.status(404).json({name: 'API', version: '1.0', status: 404, message: 'not_found'});
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