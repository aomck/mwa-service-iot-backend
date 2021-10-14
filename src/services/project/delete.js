import Parse from "../../configs/parse-iot";

export default async ({ projectId, user_id }) => {
  try {
    const projectObj = Parse.Object.extend("Project");
    const project = new projectObj();
    project.id = projectId;
    project.set("isDeleted", true);
    project.set("updatedBy", user_id);
    return await project.save();
  } catch (error) {
    console.log("error", error);
  }
};
