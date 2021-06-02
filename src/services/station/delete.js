import Parse from "../../configs/parse-iot";

export default async ({ stationId }) => {
  try {
    const stationObj = Parse.Object.extend("Project");
    const station = new stationObj();
    station.id = stationId;
    station.set("isDeleted", true);
    return station.save();
  } catch (error) {
    console.log("error", error);
  }
};
