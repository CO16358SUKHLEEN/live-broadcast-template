const StreamQuery = require("./stream.queries");
const jwtService = require("../../utils/jwt.service");
const bcrypt = require("bcrypt");
const randomString = require("../../utils/randomString");
const config = require("config");

module.exports = {
  async createStream(data) {
    let stream_id = data.stream_id;
    const product_info = await jwtService.verifyToken(data.product_token);
    if (data.type === "PUBLISH") {
      stream_id = randomString("", 10, false);
    }

    const user = await checkIfUserProductExists(
      data.product_user_id,
      product_info.product_id
    );
    let user_id, response;
    if (user.length) {
      user_id = user[0].user_id;
      await updateUserDetails({ user_id, ...data });
    } else {
      response = await createNewUser(data);
      user_id = response.user_id;

      await StreamQuery.addProductUser([
        user_id,
        data.product_user_id,
        product_info.product_id,
      ]);
    }

    let accessToken = await jwtService.generateToken({
      pname: product_info.product_name,
      uid: user_id,
      sid: stream_id,
      uname: data.user_name,
      uimg: data.user_thumbnail_image,
      role: data.type,
    });

    if (data.type === "PUBLISH") {
      const values = [stream_id, user_id, product_info.product_id];
      await StreamQuery.addStream(values);
    }

    return {
      message: "Token generated successfully",
      stream_id: stream_id,
      link: `${config.get("urls.site_url")}/live?t=${accessToken}`,
      token: accessToken,
    };
  },
};

async function checkIfUserProductExists(product_user_id, product_id) {
  const data = await StreamQuery.checkUserProductExists(
    product_user_id,
    product_id
  );
  return data;
}

async function createNewUser(data) {
  const password = await bcrypt.hash(data.user_name, 10);
  const values = [
    data.user_name,
    data.user_email,
    password,
    data.user_contact_number,
    data.user_image,
    data.user_thumbnail_image,
  ];
  const res = await StreamQuery.createUser(values);
  return { user_id: res.insertId };
}

async function updateUserDetails(data) {
  const values = [
    data.user_name,
    data.user_email,
    data.user_contact_number,
    data.user_image,
    data.user_thumbnail_image,
    data.user_id,
  ];
  const res = await StreamQuery.updateUserDetails(values);
  return { user_id: res.insertId };
}
