import Parse from "../../configs/parse-iot";
import server from "../../configs/mqtt";
import { io } from "../../index";
import axois from "axios";
import { format } from "date-fns";
import th from "date-fns/locale/th";
import { createClient } from "node-impala";
import { create } from "../device";

const client = createClient();

client.connect({
  host: "127.0.0.1",
  port: 21000,
  resultType: "json-array",
});

const mqttServer = async () => {
  try {
    server.on("clientConnected", async (client) => {
      //   console.log("Client Connected:", client.id);
      const findDevice = await new Parse.Query("Device")
        .equalTo("device_token", client.id)
        .first();

      if (!findDevice) {
        client.close();
      } else {
        const deviceQuery = await new Parse.Query("Device")
          .include(["station"])
          .get(findDevice.id);
        deviceQuery.set("isOnline", true);
        await deviceQuery.save();
        const payload = {
          code: deviceQuery.attributes.code,
          createdAt: new Date().toISOString(),
          isOnline: true,
        };
        io.emit(`iot/${deviceQuery.attributes.station.get("code")}`, payload);
        //io.emit(`iot/${deviceQuery.attributes.code}`, payload);
        // io.emit(`iot`, payload);
      }
    });
    server.on("clientDisconnected", async (client) => {
      const findDevice = await new Parse.Query("Device")
        .equalTo("device_token", client.id)
        .first();
      if (!findDevice) {
        client.close();
      } else {
        const deviceQuery = await new Parse.Query("Device")
          .include(["station"])
          .get(findDevice.id);
        deviceQuery.set("isOnline", false);
        await deviceQuery.save();
        const payload = {
          code: deviceQuery.attributes.code,
          createdAt: new Date().toISOString(),
          isOnline: false,
        };
        io.emit(`iot/${deviceQuery.attributes.station.get("code")}`, payload);
        // io.emit(`iot`, payload);
      }
    });
    server.on("published", async (packet, client) => {
      if (client) {
        console.log("Published :: ", client.id);
        const valueDevice = JSON.parse(packet.payload.toString());
        const device = await getDeviceId(packet.topic, client.id);
        if (device) {
          delete valueDevice["code"];
          const payload = {
            code: device.attributes.code,
            createdAt: new Date().toISOString(),
            value: {
              ...valueDevice,
            },
          };
          io.emit(`iot/${device.attributes.station.get("code")}`, payload);
          // io.emit(`iot`, payload);
          updateDeviceValue(
            { ...device.get("value"), ...valueDevice },
            device.id
          );
          const history = await createHistorty(valueDevice, device);
          const historyImpala = await insertImpala(valueDevice, device);
          for (const [key, value] of Object.entries(valueDevice)) {
            getParameterAndCreateNotification({ device, history, value, key });
          }
        }
      }
    });
  } catch (error) {
    console.log("error", error);
  }
};

const getDeviceId = async (code, token) => {
  const deviceQuery = new Parse.Query("Device");
  deviceQuery.equalTo("code", code).equalTo("device_token", token);
  const resp = await deviceQuery.include(["station"]).first();
  return resp;
};

const updateDeviceValue = async (payload, code) => {
  const deviceQuery = await new Parse.Query("Device").get(code);
  let tempValue = deviceQuery.get("value");
  Object.entries(payload).map(([key, value]) => {
    tempValue[key] = value;
  });
  deviceQuery.set("value", tempValue);
  deviceQuery.set("lasttime_data", new Date());
  return deviceQuery.save();
};

const createHistorty = async (payload, code) => {
  const historyObject = Parse.Object.extend("History");
  let history = new historyObject();
  history.set("value", payload);
  history.set("device", code);
  return await history.save();
};

const insertImpala = (x, y) => {
  console.log(x, y);
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
    console.log(":::", newNotification);
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
      )}\r\vอุปกรณ์ ${newNotification.attributes.device.attributes.name}  ${
        newNotification.attributes.device.attributes.description
      }\r\n${newNotification.attributes.parameter.attributes.nameTh} มีค่า ${
        newNotification.attributes.history.attributes.value[
          newNotification.attributes.parameter.attributes.key
        ]
      } ${newNotification.attributes.parameter.attributes.unit}\r\nอยู่ในเกณฑ์ 
       ${newNotification.attributes.index.name}`
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

export default mqttServer;
