const DB = require("../../loaders/mysql");

module.exports = {
  async onStreamStarted(data) {
    const query =
      "UPDATE stream_details SET stream_started_at = ? WHERE stream_id = ?";
    return await DB.query(query, [
      new Date().toISOString().slice(0, 19).replace("T", " "),
      data.id,
    ]);
  },
  async onStreamEnded(data) {
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");
    const endQuery =
      "UPDATE stream_details SET stream_ended_at = ? WHERE stream_id = ?";
    await DB.query(endQuery, [date, data.id]);
    const query = `UPDATE stream_details SET duration = (SELECT TIMESTAMPDIFF
    (SECOND, (SELECT stream_started_at FROM (SELECT stream_started_at FROM stream_details WHERE stream_id = ?) AS a), ?)) WHERE stream_id = ?`;
    return await DB.query(query, [data.id, date, data.id]);
  },
  async onRecordingReady(data) {
    const query = `UPDATE stream_details SET recording_url = ? WHERE stream_id = ?`;
    return await DB.query(query, [data.url, data.id]);
  },
  async getSendingData(data) {
    const query = `SELECT product_user_id, message_id, message, message_type FROM
     user_to_product as u INNER JOIN messages as m WHERE u.user_id = m.user_id
      AND m.stream_id = ? AND m.message_type = 1`;
    return await DB.query(query, [data.id]);
  },

  async getStreamDetails(data) {
    const query = `SELECT stream_id, duration, recording_url, stream_started_at, stream_ended_at FROM stream_details WHERE stream_id = ?`;
    return await DB.query(query, [data.id]);
  },

  async getProductWebhook(data) {
    const query = `SELECT webhook_url FROM products as p INNER JOIN stream_details as s WHERE p.product_id = s.product_id AND s.stream_id = ?`;
    return await DB.query(query, [data.id]);
  },
};
