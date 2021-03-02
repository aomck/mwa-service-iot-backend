import Parse from "../../configs/parse-iot";
import mqttClient from "../../configs/mqtt";
import { io } from "../../index";
import axois from "axios";
import { format } from "date-fns";
import th from "date-fns/locale/th";

const deviceValue = async () => {
  try {
    mqttClient.on("connect", () => {
      console.log("Conneted");
      mqttClient.subscribe("iot", (err) => {
        if (err) {
          console.log(err);
        }
      });
      mqttClient.on("message", async (topic, message) => {
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
          const notificationQuery = new Parse.Query("Notification");
          notificationQuery.equalTo("device", device);
          notificationQuery.descending("createdAt");
          notificationQuery.limit(1);
          const resultNotification = await notificationQuery.first();
          if (!resultNotification) {
            const newNotification = await createNotification({
              device,
              history,
              findAlert,
              results,
            });
            notificaitonSocket({ device, newNotification });
          } else if (resultNotification) {
            var date = new Date();
            var FIVE_MIN = 1 * 60 * 1000;

            if (
              date - new Date(resultNotification.attributes.createdAt) >
              FIVE_MIN
            ) {
              const newNotification = await createNotification({
                device,
                history,
                findAlert,
                results,
              });
              notificaitonSocket({ device, newNotification });
            } else if (
              resultNotification.attributes.index.index !== findAlert.index
            ) {
              const newNotification = await createNotification({
                device,
                history,
                findAlert,
                results,
              });
              notificaitonSocket({ device, newNotification });
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

const notificaitonSocket = async ({ device, newNotification }) => {
  try {
    io.emit(`noti`, newNotification);
    device.set("isNotification", true);
    const params = new URLSearchParams();
    params.append(
      "message",
      `\r\n${format(
        new Date(newNotification.attributes.createdAt),
        "dd MMMM yyyy HH:mm:ss",
        {
          locale: th,
        }
      )}\r\nสถานี ${newNotification.attributes.device.attributes.deviceId}  ${
        newNotification.attributes.device.attributes.description
      }\r\n${
        newNotification.attributes.parameter.attributes.nameTh
      } มีปริมาณสูงถึง ${
        newNotification.attributes.history.attributes.value[
          newNotification.attributes.parameter.attributes.key
        ]
      } ${
        newNotification.attributes.parameter.attributes.unit
      }\r\nอยู่ในเกณฑ์ ${
        newNotification.attributes.index.index === 4 ? "🟠" : "🔴"
      } ${newNotification.attributes.index.name}`
    );
    // \r\n
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer akWhE1SkmGGwVy0vSm3F2NJlXj22dldmSmIm325y0s4",
      },
    };

    await axois.post(`https://notify-api.line.me/api/notify`, params, config);
    return await device.save();
  } catch (error) {
    console.log("error", error);
  }
};

export default deviceValue;
