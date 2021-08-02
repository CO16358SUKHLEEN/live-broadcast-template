const { expressPino } = require('./pino-logger');
const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
const createError = require('http-errors');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('../routes');

module.exports = function (app) {
  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx,etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // headers for security
  app.use(helmet());

  // Middleware that transforms the raw string of req.body into json
  app.use(express.json());

  app.use(express.urlencoded({ extended: false }));

  app.use(cookieParser());

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  app.use(express.static(path.join(__dirname, 'public')));
  // for adding pino logger to each request
  app.use(expressPino);

  // The magic package that prevents frontend developers going nuts
  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  app.use("/api", routes());

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    next(createError(404));
  });

  /// error handlers
  app.use((err, req, res, next) => {

    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .send({ message: err.message })
        .end();
    }
    next(err);
  });
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json(err.json || {
      error: err.message
    });
  });
};