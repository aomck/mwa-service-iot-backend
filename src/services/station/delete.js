import Parse from "../../configs/parse-iot";

export default async ({ stationId }) => {
  try {
    const stationObj = Parse.Object.extend("Station");
    const station = new stationObj();
    station.id = stationId;
    station.set("isDeleted", true);
    return await station.save();
  } catch (error) {
    console.log("error", error);
  }
};
