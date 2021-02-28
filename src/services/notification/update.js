import Parse from "../../configs/parse-iot";

export default async ({ notificationId, body }) => {
  try {
    const notificationQuery = new Parse.Query("Notification");
    const deviceQuery = new Parse.Query("Device");
    notificationQuery.equalTo("objectId", notificationId);
    const result = await notificationQuery.first();
    if (result) {
      result.set("isShow", body.isShow && result.attributes.isShow);
      const device = await deviceQuery.get(result.attributes.device.id);
      device.set("isNotification", false);
      device.save();
      return result.save();
    }
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
