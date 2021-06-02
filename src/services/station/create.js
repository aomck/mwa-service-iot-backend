import Parse from "../../configs/parse-iot";
import parseUploadFile from "../../helpers/parse_upload_file";

export default async ({ body, file }) => {
  try {
    const userObj = new Parse.Query("Users");

    const findUser = await userObj
      .equalTo("objectId", "hx1YnEMwKl")
      .includeAll()
      .first();

    const projectQuery = new Parse.Query("Project");
    const stationObj = Parse.Object.extend("Station");
    const station = new stationObj();

    station.set("createdBy", findUser);
    if (file?.fieldname && file.fieldname === "map") {
      station.set("map", await parseUploadFile({ file }));
    }
    for await (const [key, value] of Object.entries(body)) {
      switch (key) {
        case "project":
          station.set(
            "project",
            await projectQuery.equalTo("objectId", value).first()
          );
          break;
        case "location":
          if (JSON.parse(value).latitude && JSON.parse(value).longitude) {
            station.set("location", new Parse.GeoPoint(JSON.parse(value)));
          }
          break;
        default:
          station.set(key, value);
      }
    }
    return await station.save();
  } catch (error) {
    console.log("error", error);
  }
};
