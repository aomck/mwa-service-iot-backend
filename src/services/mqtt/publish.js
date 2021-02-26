import Parse from "../../configs/parse-iot";
import mqtt from "mqtt";

var client = mqtt.connect({
  host: "68.183.225.201",
  port: 1883,
  username: "mqttuser",
  password: "mqttuser2021!",
});

const deviceValue = async () => {
  try {
    let deviceQuery = new Parse.Query("Device");

    setInterval(async () => {
      const result = await deviceQuery.find();
      result.forEach((device) => {
        client.publish(
          "iot",
          JSON.stringify({
            ...randomValue(),
            deviceId: device.attributes.deviceId,
          })
        );
      });
    }, 5000);
  } catch (error) {
    console.log("error", error);
  }
};

export default deviceValue;

export const getRndInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const randomValue = () => {
  return {
    temp: getRndInteger(25, 50),
    hum: getRndInteger(50, 80),
    light: getRndInteger(50, 80),
    pm2: getRndInteger(5, 250),
  };
};
