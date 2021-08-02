const DB = require("../../loaders/mysql");

module.exports = {
  async getPublisherId(stream_id) {
    const query =
      "SELECT initiated_by_user_id AS id, stream_ended_at FROM stream_details WHERE stream_id = ?";
    const data = await DB.query(query, [stream_id]);
    return data;
  },
  async getUserDetails(user_id) {
    const query =
      "SELECT user_id, email, full_name, contact_number, user_image, user_thumbnail_image FROM users WHERE user_id = ?";
    const data = await DB.query(query, [user_id]);
    return data;
  },

  async getSocialChannels(user_id) {
    const query = "SELECT * FROM social_stream_channels WHERE user_id = ?";
    const data = await DB.query(query, [user_id]);
    return data;
  },
};
