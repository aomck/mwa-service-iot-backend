import Parse from "../../configs/parse-iot";

export default async () => {
  try {
    const prodcutQuery = new Parse.Query("Product");
    const result = prodcutQuery.equalTo("isDeleted", false).find();
    return result;
  } catch (error) {
    console.log("error", error);
  }
};
