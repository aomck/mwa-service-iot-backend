import Parse from "../../configs/parse-iot";
import { io } from "../../index";
import axios from "axios";
import { format } from "date-fns";
import th from "date-fns/locale/th";

export default async (device, newNotification) => {
  const linenotify_token = device.get("linenotify_token");
  if (linenotify_token || linenotify_token !== "") {
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${linenotify_token}`,
      },
    };
    const params = new URLSearchParams();
    params.append(
      "message",
      `\r\n${format(
        new Date(newNotification.attributes.createdAt),
        "dd MMMM yyyy HH:mm:ss",
        {
          locale: th,
        }
      )}\r\vอุปกรณ์ ${newNotification.attributes.device.attributes.name}  ${
        newNotification.attributes.device.attributes.description
      }\r\n${newNotification.attributes.parameter.attributes.nameTh} มีค่า ${
        newNotification.attributes.history.attributes.value[
          newNotification.attributes.parameter.attributes.key
        ]
      } ${newNotification.attributes.parameter.attributes.unit}\r\nอยู่ในเกณฑ์ 
         ${newNotification.attributes.index.name}`
    );
    await axios.post(`https://notify-api.line.me/api/notify`, params, config);
  }
};
