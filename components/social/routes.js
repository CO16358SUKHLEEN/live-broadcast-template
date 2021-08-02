const { Router } = require("express");
const joiMiddleWare = require("../../utils/joiMiddleware");
const schemas = require("./schemas");
const SocialService = require("./social.service");
const { logger } = require("../../loaders/pino-logger");

const route = Router();
route.post(
  "/setDataId",
  joiMiddleWare(schemas.setDataId, "body"),
  async (req, res, next) => {
    try {
      const data = req.body;
      await SocialService.setDataId(data);
      res.send({ message: "Successful" });
    } catch (error) {
      logger.fatal(error);
      next(error);
    }
  }
);

module.exports = route;
