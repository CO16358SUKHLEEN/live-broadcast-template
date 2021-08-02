const { Router } = require("express");
const messageRoutes = require("./components/messages/routes");
const webhookRoutes = require("./components/webhook/routes");
const authRoutes = require("./components/auth/routes");
const streamRoutes = require("./components/stream/routes");
const socialRoutes = require("./components/social/routes");

module.exports = function () {
  const app = Router();

  app.use("/messages", messageRoutes);
  app.use("/webhook", webhookRoutes);
  app.use("/auth", authRoutes);
  app.use("/stream", streamRoutes);
  app.use("/social", socialRoutes);

  return app;
};
