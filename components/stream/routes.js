const { Router } = require("express");
const joiMiddleWare = require("../../utils/joiMiddleware");
const schemas = require("./schemas");
const StreamService = require("./stream.service");
const { logger } = require("../../loaders/pino-logger");

const route = Router();
route.post(
  "/create",
  joiMiddleWare(schemas.createStream, "body"),
  async (req, res, next) => {
    try {
      const data = req.body;
      const response = await StreamService.createStream(data);
      res.send(response);
    } catch (error) {
      logger.fatal(error);
      next(error);
    }
  }
);

module.exports = route;
