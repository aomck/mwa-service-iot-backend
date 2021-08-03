import Parse from "../../configs/parse-iot";

export default async () => {
  try {
    const projectQuery = new Parse.Query("Project");
    const result = projectQuery.equalTo("isDeleted", false).includeAll().find();

    return result;
  } catch (error) {
    console.log("error", error);
  }
};
