const path = require('path');
const dest = path.join(__dirname, '/../logs/info.log');
const pino = require('pino');
let logger;
if (process.env.NODE_ENV == 'production') {
  logger = pino(pino.destination({ dest, sync: false }));
} else {
  logger = pino({ level: 'trace' });
}
const randomIdGenerator = require('../utils/randomString');

const expressPino = require('pino-http')({
  genReqId: () => {
    return randomIdGenerator();
  },
  serializers: {
    req(req) {
      return requestSerializer(req);
    },
    res(res) {
      res.headers = {};
      return res;
    }
  },
  logger: logger
})

function requestSerializer(req) {
  if (process.env.NODE_ENV == 'production') {
    req.headers.cookie = {};
    req.body = req.raw.body;
    return req;
  } else {
    return {
      url: req.url,
      method: req.method,
      query: req.query,
      body: req.raw.body
    }
  }
}
exports.expressPino = expressPino;
exports.logger = logger;