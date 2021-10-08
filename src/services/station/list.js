import Parse from "../../configs/parse-iot";

export default async ({ user_id }) => {
  try {
    const stationQuery = new Parse.Query("Station");
    const result = stationQuery.equalTo("isDeleted", false).find();

    return result;
  } catch (error) {
    console.log("error", error);
  }
};
