import Parse from "../../configs/parse-iot";
import { createClient } from "node-impala";
import {
  getDeviceId,
  updateDeviceValue,
  createHistorty,
} from "../../utils/data/history";
import { getParameterAndCreateNotification } from "../../utils/data/notification";

const client = createClient();

client.connect({
  host: "127.0.0.1",
  port: 21000,
  resultType: "json-array",
});

export default async ({ body, device_code, device_token }) => {
  try {
    console.log("Hist....", device_code, device_token, body);
    const device = await getDeviceId(device_code);
    const payload = JSON.parse(JSON.stringify(body));
    updateDeviceValue(payload, device);
    const history = await createHistorty(payload, device);
    for (const [key, value] of Object.entries(payload)) {
      getParameterAndCreateNotification({
        device,
        history,
        value,
        key,
      });
    }
    // console.log("result Update Device Value", resultUpDevice.get("value"));
  } catch (error) {
    console.log("error Device Connection", error);
  }
};
