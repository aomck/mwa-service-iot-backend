import Parse from "../../configs/parse-iot";

export default async ({ query }) => {
  try {
    const notificationQuery = new Parse.Query("Notification");

    // console.log(await new Parse.Query("Device").get(query.device));

    query?.startDate &&
      notificationQuery.greaterThanOrEqualTo(
        "createdAt",
        new Date(parseInt(query.startDate))
      );

    // console.log("  notificationQuery :::", new Date(parseInt(query.startDate)));

    notificationQuery.equalTo(
      "device",
      await new Parse.Query("Device").get(query.device)
    );

    notificationQuery.include(["device.station", "history", "parameter"]);
    notificationQuery.descending("createdAt");
    notificationQuery.equalTo("isShow", true);
    notificationQuery.limit(
      parseInt(query?.limit) || (await notificationQuery.count())
    );

    console.log("notificationQuery", notificationQuery);

    const result = await notificationQuery.find();
    console.log("result :::", result.length);
    return result;
  } catch (error) {
    console.log("error", error);
  }
};
