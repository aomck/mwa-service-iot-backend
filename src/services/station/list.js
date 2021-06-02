import Parse from "../../configs/parse-iot";

export default async () => {
  try {
    const stationQuery = new Parse.Query("Station");
    const result = stationQuery.find();

    return result;
  } catch (error) {
    console.log("error", error);
  }
};
