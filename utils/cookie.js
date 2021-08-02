//Convert cookie string to object
module.exports = function (cookie) {
  cookie = cookie.split("; ").join(";");
  cookie = cookie.split(" =").join("=");
  cookie = cookie.split(";");

  var object = {};
  for (var i = 0; i < cookie.length; i++) {
    cookie[i] = cookie[i].split('=');
    object[cookie[i][0]] = decodeURIComponent(cookie[i][1]);
  }
  return object;
}
