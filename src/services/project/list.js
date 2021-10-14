import Parse from "../../configs/parse-iot";

export default async ({ user_id }) => {
  try {
    console.log("LIST PROJECT ", user_id);
    // const projectQuery = new Parse.Query("Project");
    const adminQuery = new Parse.Query("Project").equalTo("admin", user_id);
    const managerQuery = new Parse.Query("Project").equalTo("manager", user_id);
    const viewerQuery = new Parse.Query("Project").equalTo("viewer", user_id);
    const allQuery = Parse.Query.or(adminQuery, managerQuery, viewerQuery);
    const result = await allQuery
      .equalTo("isDeleted", false)
      .equalTo("isActive", true)
      .includeAll()
      .find();
    // console.log("result", result);
    return result;
  } catch (error) {
    console.log("error", error);
  }
};
