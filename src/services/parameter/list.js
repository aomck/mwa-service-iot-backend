import Parse from "../../configs/parse-iot";

export default () => {
  try {
    const parameterQuery = new Parse.Query("Parameter");
    const result = parameterQuery.find();
    return result;
  } catch (error) {
    console.log("error");
  }
};
