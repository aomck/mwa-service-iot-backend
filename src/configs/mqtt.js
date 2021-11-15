import mosca from "mosca";

var settings = {
  port: 1883,
};
var server = new mosca.Server(settings);
server.on("ready", setup);
function setup() {
  server.authenticate = authenticate;
  console.log("Mosca server is up and running (auth)");
}
var authenticate = function (client, username, password, callback) {
  var authorized =
    username === process.env.MQTT_USERNAME &&
    password.toString() === process.env.MQTT_PASSWORD;
  if (authorized) client.user = username;
  callback(null, authorized);
};

export default server;
