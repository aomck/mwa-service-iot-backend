import Parse from "../../configs/parse-iot";

export default async ({ deviceId }) => {
  try {
    let query = await new Parse.Query("Device").get(deviceId);
    return query;
  } catch (error) {
    console.log("error", error);
  }
};
