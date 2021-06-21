import Parse from "../../configs/parse-iot";
import axios from "axios";
export default async ({ session }) => {
  try {
    const mqttQuery = await new Parse.Query("Configuration")
      .equalTo("type", "MQTT")
      .find();
    let mqttConfig = {};
    mqttQuery.map((s) => {
      mqttConfig[s.get("key")] = s.get("value");
    });
    return { mqtt: mqttConfig };
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
