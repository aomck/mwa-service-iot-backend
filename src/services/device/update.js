import Parse from "../../configs/parse-iot";
import mqttClient from "../../configs/mqtt";

export default ({ query }) => {
  try {
    // console.log("query :::", query);
    if (query?.v1) {
      console.log("query :::", query);
      mqttClient.publish("control/AAA", JSON.stringify(query.v1));
    }
    return "success";
  } catch (error) {
    console.log("error");
  }ไ
};
