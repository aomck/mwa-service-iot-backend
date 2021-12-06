import Parse from "../../configs/parse-iot";

export default async ({ lora_id }) => {
  try {
    // const deviceObj = Parse.Object.extend("Device");
    // const device = new deviceObj();
    // device.id = deviceId;
    const loraDevieQuery = new Parse.Query("LoraDevice");
    loraDevieQuery.equalTo("lora_id", lora_id);
    const result = await loraDevieQuery.find();
    console.log("status ::  ", result);
  } catch (error) {
    console.log("error");
  }
};
