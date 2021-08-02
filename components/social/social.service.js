const SocialQuery = require("./social.queries");
const config = require("config");

module.exports = {
  async setDataId(data) {
    await SocialQuery.setDataId(data);
    return;
  },
};
