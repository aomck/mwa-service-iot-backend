import Parse from "../../configs/parse-iot";

export default ({ user_id, query }) => {
  try {
    let parameterQuery = new Parse.Query("Parameter");
    if (query.search) {
      let codeQuery = new Parse.Query("Parameter");
      codeQuery.matches("key", `.*${query.search}.*`);
      let nameQuery = new Parse.Query("Parameter");
      nameQuery.matches("name", `.*${query.search}.*`);
      let nameThQuery = new Parse.Query("Parameter");
      nameThQuery.matches("nameTh", `.*${query.search}.*`);
      let unitQuery = new Parse.Query("Parameter");
      unitQuery.matches("unit", `.*${query.search}.*`);
      let tagQuery = new Parse.Query("Parameter");
      tagQuery.matches("tag", query.search);
      parameterQuery = Parse.Query.or(
        codeQuery,
        nameQuery,
        nameThQuery,
        unitQuery,
        tagQuery
      );
    }
    const result = parameterQuery
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
