import Parse from "../../configs/parse-iot";

export default async ({ projectId, user_id }) => {
  try {
    const projectObj = await new Parse.Query("Project")
      .equalTo("code", projectId)
      .first();
    const stationQuery = new Parse.Query("Station");
    const result = stationQuery
      .equalTo("isActive", true)
      .equalTo("isDeleted", false)
      .equalTo("project", projectObj)
      .include("project")
      .find();
    // console.log("XXXXX", result);
    return await result;
  } catch (error) {
    console.log("error", error);
  }
};
