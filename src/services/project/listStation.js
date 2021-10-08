import Parse from "../../configs/parse-iot";

export default async ({ user_id }) => {
  try {
    console.log("LIST Station ", user_id);
    // const projectQuery = new Parse.Query("Project");
    const adminQuery = new Parse.Query("Project").equalTo("admin", user_id);
    const managerQuery = new Parse.Query("Project").equalTo("manager", user_id);
    const viewerQuery = new Parse.Query("Project").equalTo("viewer", user_id);
    const allQuery = Parse.Query.or(adminQuery, managerQuery, viewerQuery);
    const projectResult = await allQuery
      .equalTo("isDeleted", false)
      .equalTo("isActive", true)
      .includeAll()
      .find();
    // console.log("result", projectResult);
    const projectQuery = projectResult.map((project) => {
      return new Parse.Query("Station").equalTo("project", project);
    });
    const stationQuery = Parse.Query.or(...projectQuery);
    // console.log("-->", JSON.parse(JSON.stringify(stationQuery)));
    const result = await stationQuery
      .equalTo("isDeleted", false)
      .equalTo("isActive", true)
      .includeAll()
      .find();
    return result;
  } catch (error) {
    console.log("error", error);
  }
};
