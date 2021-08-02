const { Router } = require("express");
const joiMiddleWare = require("../../utils/joiMiddleware");
const schemas = require("./schemas");
const { logger } = require("../../loaders/pino-logger");
const MessageService = require("./messages.service");

const route = Router();
route.get(
  "/get",
  joiMiddleWare(schemas.getMessages.headers, "headers"),
  joiMiddleWare(schemas.getMessages.query, "query"),
  async (req, res, next) => {
    try {
      const data = req.query;
      const response = await MessageService.getMessages(data);
      res.send({ data: response });
    } catch (error) {
      logger.fatal(error);
      next(error);
    }
  }
);

module.exports = route;
