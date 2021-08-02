const { Router } = require("express");
const joiMiddleWare = require("../../utils/joiMiddleware");
const schemas = require("./schemas");
const AuthService = require("./auth.service");
const { logger } = require("../../loaders/pino-logger");

const route = Router();
route.post(
  "/login",
  joiMiddleWare(schemas.login, "headers"),
  async (req, res, next) => {
    try {
      const data = req.headers;
      const response = await AuthService.login(data);
      res.send(response);
    } catch (error) {
      logger.fatal(error);
      next(error);
    }
  }
);

module.exports = route;
