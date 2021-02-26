import Parse from "../../configs/parse-iot";

export default ({ deviceId }) => {
  try {
    const query = new Parse.Query("History");
    query.descending("createdAt");
    // query.includeAll("*");
    query.id = deviceId;
    const result = query.find();
    return result;
  } catch (error) {
    console.log("error");
  }
};
