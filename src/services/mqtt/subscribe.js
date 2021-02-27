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
        const valueDevice = JSON.parse(message);
        const device = await getDeviceId(valueDevice.deviceId);
        if (device) {
          delete valueDevice["deviceId"];
          const payload = {
            deviceId: device.attributes.deviceId,
            createdAt: new Date().toISOString(),
            value: {
              ...valueDevice,
            },
          };
          io.emit(`iot/${device.attributes.deviceId}`, payload);
          io.emit(`iot`, payload);
          updateDeviceValue(valueDevice, device.id);
          const history = await createHistorty(valueDevice, device);

          for (const [key, value] of Object.entries(valueDevice)) {
            // console.log(`${key}: ${value}`);
            getParameterAndCreateNotification({ device, history, value, key });
          }
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

const getParameterAndCreateNotification = async ({
  device,
  history,
  value,
  key,
}) => {
  // console.log("device", device);
  // console.log("history", history);
  // console.log("value", value);
  // console.log("key :::", key);
  const parameterQuery = new Parse.Query("Parameter");
  parameterQuery.equalTo("key", key);
  parameterQuery
    .first()
    .then(async (results) => {
      const arrayIndex = results.attributes.index;
      if (arrayIndex) {
        const findAlert = results.attributes.index.find((val) => {
          if (
            val.alert === true &&
            value >= val.value.min &&
            value <= val.value.max
          ) {
            return val;
          }
        });
        if (findAlert) {
          // console.log("findAlert :::", findAlert);
          const notificationQuery = new Parse.Query("Notification");
          notificationQuery.descending("createdAt");
          notificationQuery.equalTo("device", device);
          notificationQuery.equalTo("index.index", findAlert.index);
          const resultNotification = await notificationQuery.first();
          if (!resultNotification) {
            createNotification({ device, history, findAlert, results });
          } else if (resultNotification) {
            var date = new Date();
            var FIVE_MIN = 1 * 60 * 1000;

            if (
              date - new Date(resultNotification.attributes.createdAt) >
              FIVE_MIN
            ) {
              createNotification({ device, history, findAlert, results });
            }
          }
        }
      }
    })
    .catch((error) => {
      console.log("results :::", error);
    });
};

const createNotification = ({ device, history, findAlert, results }) => {
  const notificationObject = Parse.Object.extend("Notification");
  let notification = new notificationObject();
  notification.set("device", device);
  notification.set("history", history);
  notification.set("index", findAlert);
  notification.set("parameter", results);
  notification.set("isShow", true);
  return notification.save();
};

export default deviceValue;
