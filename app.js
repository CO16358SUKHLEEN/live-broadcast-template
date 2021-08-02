const expressLoader = require("./loaders/express");
const express = require("express");
const app = express();

expressLoader(app);
// app.use(function (req, res, next) {
//   res.log = res.log.child({ body: res.body });
//   next();
// });
// app.use('/', indexRouter);

// app.get('/messages', MessagesRouter);
// app.post('/auth/signup', AuthRouter);
// app.post('/webhook', WebhookRouter);

module.exports = app;
