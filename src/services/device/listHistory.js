import Parse from "../../configs/parse-iot";

export default () => {
  try {
    const historyQuery = new Parse.Query("History");
    const result = historyQuery.find();
    return result;
  } catch (error) {
    console.log("error", error);
  }
};
