import Parse from "../../configs/parse-iot";

export default ({ user_id, query }) => {
  try {
    let allQuery = new Parse.Query("DisplayType");
    if (query.search) {
      let codeQuery = new Parse.Query("DisplayType");
      codeQuery.matches("key", `.*${query.search}.*`);
      let nameQuery = new Parse.Query("DisplayType");
      nameQuery.matches("name", `.*${query.search}.*`);
      let nameThQuery = new Parse.Query("DisplayType");
      nameThQuery.matches("nameTh", `.*${query.search}.*`);
      let unitQuery = new Parse.Query("DisplayType");
      unitQuery.matches("unit", `.*${query.search}.*`);
      let tagQuery = new Parse.Query("DisplayType");
      tagQuery.matches("tag", query.search);
      allQuery = Parse.Query.or(
        codeQuery,
        nameQuery,
        nameThQuery,
        unitQuery,
        tagQuery
      );
    }
    const result = allQuery
      .include(["display"])
      .equalTo("isDeleted", false)
      .equalTo("isActive", true)
      .descending("createdAt")
      .find();
    return result;
  } catch (error) {
    console.log("error", error);
  }
};
