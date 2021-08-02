const socketio = require("socket.io");
const MessageService = require("../components/messages/messages.service");
const jwtService = require("../utils/jwt.service");
const randomString = require("../utils/randomString");
const axios = require("axios");
const config = require("config");

let io = socketio({ transports: ["websocket"] });
io.use(async (socket, next) => {
  let token = socket.handshake.query.token;
  if (token) {
    const userData = await jwtService.verifyToken(token);
    socket.user_id = userData.uid;
    socket.full_name = userData.uname;
    socket.stream_id = userData.sid;
    socket.user_image = userData.uimg;
    socket.role = userData.role;
    return next();
  }
  return next(new Error("authentication error"));
});

io.on("connection", async (socket) => {
  console.log("a user connected");
  let viewerCount = 0,
    intervalId;
  if (socket.role == "PUBLISH") {
    intervalId = setInterval(async () => {
      const latestViewerCount = await getWatcherCount(socket.stream_id);
      if (latestViewerCount > -1 && viewerCount != latestViewerCount) {
        io.in(socket.stream_id).emit("viewer_count", {
          count: latestViewerCount,
        });
        viewerCount = latestViewerCount;
      }
    }, 2000);
  }
  socket.join(socket.stream_id);
  if (socket.full_name) {
    const obj = {
      message: `${socket.full_name} joined.`,
      user_id: socket.user_id,
      muid: randomString(),
      stream_id: socket.stream_id,
      message_type: 2,
      full_name: socket.full_name,
    };
    io.in(socket.stream_id).emit("user_joined", obj);
    MessageService.insertMessagesToDB(obj);
  }
  socket.on("message", async (data, cb) => {
    if (!data.message || !data.muid || !data.message_type) {
      cb(new Error("message was not delivered"), null);
    }
    const obj = {
      ...data,
      user_id: socket.user_id,
      full_name: socket.full_name,
      stream_id: socket.stream_id,
      user_image: socket.user_image,
    };
    await MessageService.insertMessagesToDB(obj);
    cb(null, obj);
    socket.to(socket.stream_id).emit("message", obj);
  });
  socket.on("disconnect", () => {
    clearInterval(intervalId);
    if (socket.full_name) {
      const obj = {
        message: `${socket.full_name} left.`,
        user_id: socket.user_id,
        muid: randomString(),
        stream_id: socket.stream_id,
        message_type: 2,
        full_name: socket.full_name,
      };
      io.in(socket.stream_id).emit("user_left", obj);
      MessageService.insertMessagesToDB(obj);
    }
    console.log("user disconnected");
  });
});

async function getWatcherCount(stream_id) {
  const res = await axios.get(
    `${config.get("urls.broadcast_url")}/${config.get(
      "ant.rtc"
    )}/rest/v2/broadcasts/${stream_id}/broadcast-statistics`
  );
  return res.data.totalWebRTCWatchersCount;
}
module.exports = io;
