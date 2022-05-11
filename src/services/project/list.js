import Parse from "../../configs/parse-iot";

export default async ({ user_id, query }) => {
  try {
    // console.log("LIST PROJECT ", user_id);
    // console.log("list project query", query);
    // const projectQuery = new Parse.Query("Project");
    const adminQuery = new Parse.Query("Project").equalTo("admin", user_id);
    const managerQuery = new Parse.Query("Project").equalTo("manager", user_id);
    const viewerQuery = new Parse.Query("Project").equalTo("viewer", user_id);
    const createdQuery = new Parse.Query("Project").equalTo("createdBy", user_id);
    let roleQuery = Parse.Query.or(adminQuery, managerQuery, viewerQuery,createdQuery);
    let allQuery = new Parse.Query("Project");
    if (query.search) {
      let codeQuery = new Parse.Query("Project");
      codeQuery.matches("code", `.*${query.search}.*`);
      let nameQuery = new Parse.Query("Project");
      nameQuery.matches("name", `.*${query.search}.*`);
      let tagQuery = new Parse.Query("Project");
      tagQuery.matches("tag", query.search);
      let searchQuery = Parse.Query.or(codeQuery, nameQuery, tagQuery);
      allQuery = Parse.Query.and(searchQuery, roleQuery);
    } else {
      allQuery = roleQuery;
    }

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
