import Parse from "../../configs/parse-iot";

export default async ({ query }) => {
  try {
    const notificationQuery = new Parse.Query("Notification");
    notificationQuery.includeAll("*");
    notificationQuery.descending("createdAt");
    notificationQuery.equalTo("isShow", true);
    notificationQuery.limit(
      parseInt(query?.limit) || (await notificationQuery.count())
    );
    const result = notificationQuery.find();
    return result;
  } catch (error) {
    console.log("error");
  }
};
