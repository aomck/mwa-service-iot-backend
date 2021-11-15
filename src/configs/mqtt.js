import mqtt from "mqtt";

var mqttClient = mqtt.connect({
  host: "128.199.153.38",
  port: 1883,
  username: "mqttuser",
  password: "mqttuser2021!",
});

export default mqttClient;
