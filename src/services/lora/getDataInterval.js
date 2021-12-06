import Parse from "../../configs/parse-iot";

const getLoRaDeviceValue = async () => {
  try {
    setInterval(async () => {
      console.log("Cycle", process.env.LORA_INTERVAL);
      const deviceTypeObj = new Parse.Object("DeviceType");
      deviceTypeObj.id = "FAVeTPouLC";

      const deviceQuery = new Parse.Query("Device");
      deviceQuery.equalTo("type", deviceTypeObj);
      const result = await deviceQuery.find();

      const deviceList = JSON.parse(JSON.stringify(result));
      deviceList.forEach((d) => {
        console.log(d.config);
      });
    }, parseInt(10000)); //process.env.LORA_INTERVAL
  } catch (error) {
    console.log("error");
  }
};

export default getLoRaDeviceValue;
