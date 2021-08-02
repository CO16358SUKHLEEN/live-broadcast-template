const DB = require("../../loaders/mysql");

module.exports = {
  async checkUserProductExists(product_user_id, product_id) {
    const query =
      "SELECT * FROM user_to_product AS u WHERE u.product_user_id = ? AND u.product_id = ?";
    const data = await DB.query(query, [product_user_id, product_id]);
    return data;
  },
  async addStream(values) {
    const query =
      "INSERT INTO stream_details (stream_id, initiated_by_user_id, product_id) VALUES (?)";
    const result = await DB.query(query, [values]);
    return result;
  },
  async addProductUser(values) {
    const query =
      "INSERT INTO user_to_product (user_id, product_user_id, product_id) VALUES (?)";
    const result = await DB.query(query, [values]);
    return result;
  },
  async createUser(values) {
    const query =
      "INSERT INTO users (full_name, email, password, contact_number, user_image, user_thumbnail_image) VALUES (?)";
    const result = await DB.query(query, [values]);
    return result;
  },
  async updateUserDetails(values) {
    const query = `UPDATE users SET full_name = ?, email = ?,
     contact_number = ?, user_image = ?,
    user_thumbnail_image = ? WHERE user_id = ?`;
    const result = await DB.query(query, values);
    return result;
  },
};
