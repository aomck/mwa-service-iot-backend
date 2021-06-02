import Parse from "../../configs/parse-iot";

export default async ({ projectId }) => {
  try {
    const projectQuery = new Parse.Query("Project");
    const result = await projectQuery
      .equalTo("objectId", projectId)
      .equalTo("isDeleted", false)
      .first();
    return result;
  } catch (error) {
    console.log("error", error);
  }
};
