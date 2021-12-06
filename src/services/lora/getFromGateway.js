import Parse from "../../configs/parse-iot";

export default async ({ lora_id }) => {
  try {
    const deviceQuery = new Parse.Query("LoraDevice");
    deviceQuery.equalTo("lora_id", lora_id);
    const result = await deviceQuery.find();
    console.log("LORA : ", JSON.parse(JSON.stringify(result)));
    return result;
  } catch (error) {
    console.log("error");
  }
};
