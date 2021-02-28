import mqtt from "mqtt";

var mqttClient = mqtt.connect({
  host: "68.183.225.201",
  port: 1883,
  username: "mqttuser",
  password: "mqttuser2021!",
});

export default mqttClient;
