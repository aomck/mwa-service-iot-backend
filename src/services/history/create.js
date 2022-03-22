import { io } from "../../index";
import {
  getDeviceId,
  updateDeviceValue,
  createHistorty,
} from "../../utils/data/history";
import { getParameterAndCreateNotification } from "../../utils/data/notification";
import { insert } from "../bigdata";

export default async ({ body, device_code, device_token }) => {
  try {
    console.log("Hist....", device_code, device_token, body);
    const device = await getDeviceId(device_code);
    const payload = JSON.parse(JSON.stringify(body));
    updateDeviceValue(payload, device);
    const history = await createHistorty(payload, device);
    const datetime = new Date().toISOString();
    const noti_payload = {
      code: device.attributes.code,
      deviceId: device.id,
      createdAt: datetime,
      value: {
        ...payload,
      },
    };
    console.log(
      "station ... code ::: ",
      device.attributes.station.get("code"),
      noti_payload
    );
    io.emit(`iot/${device.attributes.station.get("code")}`, noti_payload);
    for (const [key, value] of Object.entries(payload)) {
      getParameterAndCreateNotification({
        device,
        history,
        value,
        key,
      });
    }
    insert(device_code, datetime, payload);
    return "success";
    // console.log("result Update Device Value", resultUpDevice.get("value"));
  } catch (error) {
    console.log("error Device Connection", error);
  }
};
