const jwtService = require("../../utils/jwt.service");
const AuthQuery = require("./auth.queries");
const axios = require("axios");
const config = require("config");

module.exports = {
  async login(data) {
    let array = [];
    const user = await jwtService.verifyToken(data.token);
    // if (data.stream_id !== user.stream_id) {
    //   throw createError(400, "access token is from some other stream");
    // }
    const [publisher] = await AuthQuery.getPublisherId(user.sid);
    const [userDetails] = await AuthQuery.getUserDetails(user.uid);
    const userRole = publisher.id == user.uid ? "publish" : "play";
    if (userRole != "publish") {
      const [publisherDetails] = await AuthQuery.getUserDetails(publisher.id);
      userDetails.publisher_name = publisherDetails.full_name;
      userDetails.publisher_image = publisherDetails.user_image;
    } else {
      array = await getSocialMedia(user.uid);
    }
    const antMediaToken = await getToken({
      stream_id: user.sid,
      user_type: userRole,
    });
    return {
      ...userDetails,
      product_name: user.pname.toUpperCase(),
      role: antMediaToken.type.toUpperCase(),
      token_expiry: antMediaToken.expireDate,
      stream_token: antMediaToken.tokenId,
      stream_id: antMediaToken.streamId,
      social: [...array],
    };
  },
};

async function getToken(data) {
  const expire = Math.ceil(new Date().getTime() / 1000) + 604800;

  const response = await axios.get(
    `${config.get("urls.broadcast_url")}/rest/request?_path=${config.get(
      "ant.rtc"
    )}/rest/v2/broadcasts/${data.stream_id}/token&expireDate=${expire}&type=${
      data.user_type
    }`
  );
  return response.data;
}

async function getSocialMedia(userId) {
  const res = await AuthQuery.getSocialChannels(userId);
  const { data } = await axios.get(
    `${config.get("urls.broadcast_url")}/${config.get(
      "ant.rtc"
    )}/rest/v2/broadcasts/social-endpoints/0/20`
  );

  const arr = [];

  for (let i = 0; i < res.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (res[i].channel_id === data[j].id) {
        arr.push(data[j]);
        break;
      }
    }
  }

  return [...arr];
}
