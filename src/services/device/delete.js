import Parse from "../../configs/parse-iot";

export default async ({ deviceId }) => {
  try {
    const deviceObj = Parse.Object.extend("Device");
    const device = new deviceObj();
    device.id = deviceId;
    device.set("isDeleted", true);
    return await device.save();
  } catch (error) {
    console.log("error", error);
  }
};
