import Parse from "../../configs/parse-iot";
import parseUploadFile from "../../helpers/parse_upload_file";

export default async ({ body, files, stationId, user_id }) => {
  try {
    // console.log("==> Body", body);
    // console.log("==> File", files);
    // console.log("==> Station", stationId);

    const stationObj = Parse.Object.extend("Station");
    const station = new stationObj();
    station.id = stationId;

    station.set("updatedBy", user_id);
    if (files && files.length > 0) {
      files.map(async (file) => {
        station.set(file.originalname, await parseUploadFile({ file }));
      });
    }
    for await (const [key, value] of Object.entries(body)) {
      switch (key) {
        case "location":
          const location = JSON.parse(value);
          // console.log(">>>>", location);
          if (location.latitude && location.longitude) {
            station.set("location", new Parse.GeoPoint(location));
          }
          break;
        case "isActive":
          station.set(key, value === "true" ? true : false);
          break;
        case "tag":
          if (value === "") {
            station.set(key, []);
          } else {
            station.set(key, value.split(","));
          }
          break;
        case "admin":
          if (value === "") {
            station.set(key, []);
          } else {
            // console.log(">>>>>>>", value.split(","));
            station.set(key, value.split(","));
          }
          break;
        case "manager":
          if (value === "") {
            station.set(key, []);
          } else {
            station.set(key, value.split(","));
          }
          break;
        case "viewer":
          if (value === "") {
            station.set(key, []);
          } else {
            station.set(key, value.split(","));
          }
          break;
        default:
          station.set(key, value);
          break;
      }
    }
    return await station.save();
  } catch (error) {
    console.log("error", error);
  }
};
