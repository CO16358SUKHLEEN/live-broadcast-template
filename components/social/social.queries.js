const DB = require("../../loaders/mysql");

module.exports = {
  async setDataId(value) {
    const query =
      "INSERT INTO social_stream_channels (user_id, channel_id) VALUES (?,?)";
    const data = await DB.query(query, [value.user_id, value.channel_id]);
    return data;
  },
};
