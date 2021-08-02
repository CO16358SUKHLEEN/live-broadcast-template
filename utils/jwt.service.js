const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = {
  async generateToken(data) {
    return jwt.sign(data, config.get("jwt.secret_key"));
  },
  async verifyToken(token) {
    return jwt.verify(token, config.get("jwt.secret_key"));
  },
};
