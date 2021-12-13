import Parse from "../../configs/parse-iot";
import axios from "axios";
import { io } from "../../index";
import { insert } from "../bigdata";

const getLoRaDeviceValue = async () => {
  try {
    const isDev = process.env.LORA_ISDEV === "True" ? true : false;
    setInterval(async () => {
      // console.log("Cycle", process.env.LORA_INTERVAL);
      const deviceTypeObj = new Parse.Object("DeviceType");
      deviceTypeObj.id = "FAVeTPouLC";

      const deviceQuery = new Parse.Query("Device");
      deviceQuery.equalTo("type", deviceTypeObj);
      const result = await deviceQuery.find();

      const deviceList = JSON.parse(JSON.stringify(result));
      deviceList.forEach(async (d) => {
        const loraConfig = d.config?.lora_gateway;
        // console.log(loraConfig);
        const LoraResult = await axios.get(
          `${isDev ? "http://localhost:7000/lora-api" : loraConfig.api}/${
            loraConfig.lora_id
          }`,
          {
            headers: {
              lora_token: loraConfig.lora_token,
            },
          }
        );
        // console.log(".... result", LoraResult.data);
        const LoraDeviceQuery = new Parse.Query("Device");
        LoraDeviceQuery.include(["station"]).equalTo(
          "code",
          LoraResult.data.lora_id
        );
        const loraObj = await LoraDeviceQuery.first();
        if (LoraResult.data.isOnline === true) {
          // console.log("ONLINE >>>>>>> >>>");
          const datetime = new Date().toISOString();
          const payload = {
            code: loraObj.attributes.code,
            createdAt: datetime,
            isOnline: true,
          };

          loraObj.set("isOnline", true);
          loraObj.set("value", LoraResult.data.value);
          insert(loraObj.attributes.code, datetime, LoraResult.data.value);
          io.emit(`iot/${loraObj.attributes.station.get("code")}`, payload);
        } else {
          const payload = {
            code: loraObj.attributes.code,
            createdAt: new Date().toISOString(),
            isOnline: false,
          };
          loraObj.set("isOnline", false);
          io.emit(`iot/${loraObj.attributes.station.get("code")}`, payload);
        }
        const resultSave = await loraObj.save();
        // console.log("---->", resultSave);
      });
    }, parseInt(process.env.LORA_INTERVAL)); //process.env.LORA_INTERVAL
  } catch (error) {
    console.log("error");
  }
};

export default getLoRaDeviceValue;
