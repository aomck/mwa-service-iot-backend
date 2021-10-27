import Parse from "../../configs/parse-iot";

export default async ({ projectId, query, user_id }) => {
  try {
    const projectObj = await new Parse.Query("Project")
      .equalTo("code", projectId)
      .first();
    let stationQuery = new Parse.Query("Station");
    if (query.search) {
      let codeQuery = new Parse.Query("Station");
      codeQuery.matches("code", `.*${query.search}.*`);
      let nameQuery = new Parse.Query("Station");
      nameQuery.matches("name", `.*${query.search}.*`);
      let tagQuery = new Parse.Query("Station");
      tagQuery.matches("tag", query.search);
      stationQuery = Parse.Query.or(codeQuery, nameQuery, tagQuery);
    }

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
