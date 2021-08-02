const DB = require('../../loaders/mysql');

module.exports = {
  async  getMessagesFromDB(id) {
    const query = "SELECT m.*, u.full_name, u.user_thumbnail_image as user_image FROM messages m INNER JOIN users u ON m.user_id = u.user_id WHERE m.stream_id = ? ";
    const res = await DB.query(query, [id]);
    return res;
  },
  async insertMessageToDB(data) {
    if (!data.message_type) {
      data.message_type = 1;
    }
    const query = `INSERT INTO messages (message, stream_id, user_id, message_type, muid) VALUES(?,?,?,?,?)`;
    const response = await DB.query(query, [data.message, data.stream_id, data.user_id, data.message_type, data.muid]);
    return response;
  }
}