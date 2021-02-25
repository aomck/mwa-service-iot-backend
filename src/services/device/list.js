import Parse from "../../configs/parse-iot";

export default () => {
  try {
    const deviceQuery = new Parse.Query("Device");
    const result = deviceQuery.find();
    return result;
  } catch (error) {
    console.log("error");
  }
};
