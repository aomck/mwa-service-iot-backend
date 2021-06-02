import Parse from "../../configs/parse-iot";

export default async ({ stationId }) => {
  try {
    const stationQuery = new Parse.Query("Station");
    const result = await stationQuery
      .equalTo("objectId", stationId)
      .equalTo("isDeleted", false)
      .first();
    return result;
  } catch (error) {
    console.log("error", error);
  }
};
