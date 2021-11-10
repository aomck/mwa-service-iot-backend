import Parse from "../../configs/parse-iot";

export default () => {
  try {
    const query = new Parse.Query("DeviceType");
    query.equalTo("isDeleted", false);
    query.equalTo("isActive", true);
    const result = query.find();
    return result;
  } catch (error) {
    console.log("error");
  }
};
