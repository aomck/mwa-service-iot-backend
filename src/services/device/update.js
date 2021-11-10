import Parse from "../../configs/parse-iot";
import parseUploadFile from "../../helpers/parse_upload_file";
import mqttClient from "../../configs/mqtt";

export default async ({ body, deviceId, files, user_id }) => {
  try {
    const deviceObj = Parse.Object.extend("Device");
    const device = new deviceObj();
    device.id = deviceId;

    // console.log("user", user_id);
    console.log("Body .... ", body);
    // console.log("FIles", files);

    device.set("updatedBy", user_id);
    if (files && files.length > 0) {
      files.map(async (file) => {
        device.set(file.originalname, await parseUploadFile({ file }));
      });
    }
    for await (const [key, value] of Object.entries(body)) {
      switch (key) {
        case "isActive":
          device.set(key, value === "true" ? true : false);
          break;
        case "isNotification":
          device.set(key, value === "true" ? true : false);
          break;
        case "tag":
          if (value === "") {
            device.set(key, []);
          } else {
            device.set(key, value.split(","));
          }
          break;
        case "template":
          const deviceTempId = JSON.parse(value).objectId;
          const templateObj = await new Parse.Query("DeviceTemplate").get(
            deviceTempId
          );
          device.set(key, templateObj);
          break;
        case "type":
          const deviceTypeId = JSON.parse(value).objectId;
          const typeObj = await new Parse.Query("DeviceType").get(deviceTypeId);
          device.set(key, typeObj);
          break;
        case "installation_date":
          device.set(key, new Date(value));
          break;
        case "position":
          device.set(key, JSON.parse(value));
          break;
        default:
          device.set(key, value);
          break;
      }
    }
    return await device.save();
    // console.log("query :::", query);
    // if (query?.v1) {
    //   console.log("query :::", query);
    //   mqttClient.publish("control/AAA", JSON.stringify(query.v1));
    // }
    // return "success";
  } catch (error) {
    console.log("error", error);
  }
  ไ;
};
