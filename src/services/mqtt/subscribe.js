import Parse from "../../configs/parse-iot";
import mqtt from "mqtt";
import { io } from "../../index";

var client = mqtt.connect({
  host: "68.183.225.201",
  port: 1883,
  username: "mqttuser",
  password: "mqttuser2021!",
});

const deviceValue = async () => {
  try {
    client.on("connect", () => {
      console.log("Conneted");
      client.subscribe("iot", (err) => {
        if (err) {
          console.log(err);
        }
      });
      client.on("message", async (topic, message) => {
        const value = JSON.parse(message);
        const resp = await getDeviceId(value.deviceId);
        if (resp) {
          // console.log("io", io.emit);
          io.emit(`iot/${value.deviceId}`, {
            ...value,
            createdAt: new Date().toISOString(),
          });
          io.emit(`iot`, {
            ...value,
            createdAt: new Date().toISOString(),
          });
          delete value["deviceId"];
          updateDeviceValue(value, resp.id);
          createHistorty(value, resp);
        }
      });
    });
  } catch (error) {
    console.log("error", error);
  }
};

const getDeviceId = async (deviceId) => {
  const deviceQuery = new Parse.Query("Device");
  deviceQuery.equalTo("deviceId", deviceId);
  const resp = await deviceQuery.first();
  return resp;
};

const updateDeviceValue = async (payload, deviceId) => {
  const deviceQuery = await new Parse.Query("Device").get(deviceId);
  deviceQuery.set("value", payload);
  return deviceQuery.save();
};

const createHistorty = async (payload, deviceId) => {
  const historyObject = Parse.Object.extend("History");
  let history = new historyObject();
  history.set("value", payload);
  history.set("device", deviceId);
  return await history.save();
};

export default deviceValue;
