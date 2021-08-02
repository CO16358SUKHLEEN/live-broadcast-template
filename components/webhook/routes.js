const { Router } = require("express");
const { logger } = require("../../loaders/pino-logger");
const WebhookService = require("./webhook.service");

const route = Router();
route.post("/streams", async (req, res, next) => {
  try {
    const data = req.body;
    const response = await WebhookService.onWebhookReceived(data);
    res.send({ message: "Success" });
  } catch (error) {
    logger.fatal(error);
    next(error);
  }
});

module.exports = route;
