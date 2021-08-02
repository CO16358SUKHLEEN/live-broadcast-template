const MessageQuery = require('./messages.queries');

module.exports = {
  async getMessages(data) {
    const response = await MessageQuery.getMessagesFromDB(data.stream_id);
    return response;
  },
  async insertMessagesToDB(data) {
    const response = await MessageQuery.insertMessageToDB(data);
    return response;
  }
}