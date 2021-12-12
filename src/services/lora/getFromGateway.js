import Parse from "../../configs/parse-iot";
// return true;
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export default async ({ lora_id, lora_token }) => {
  try {
    // console.log("LORA >>>>> ", lora_id, lora_token);

    const deviceQuery = new Parse.Query("LoraDevice");
    // deviceQuery.equalTo("lora_id", lora_id);
    deviceQuery.equalTo("lora_token", lora_token);
    const result = await deviceQuery.first();
    const loraDevice = JSON.parse(JSON.stringify(result));
    // console.log("LORA : ", loraDevice);
    loraDevice.value = {
      suction_time: getRandomInt(45, 65),
      flush_time: getRandomInt(5, 15),
      suction_realtime: getRandomInt(1, 65),
      flush_realtime: getRandomInt(1, 15),
    };

    return loraDevice;
  } catch (error) {
    console.log("error");
  }
};
