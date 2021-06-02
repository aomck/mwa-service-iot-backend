import Parse from "../../configs/parse-iot";

export default async ({ projectId }) => {
  try {
    // const projectQuery = new Parse.Query("Project");
    // const result = await projectQuery.equalTo("objectId", projectId).first();
    return projectId;
  } catch (error) {
    console.log("error", error);
  }
};
