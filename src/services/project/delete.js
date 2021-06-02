import Parse from "../../configs/parse-iot";

export default async ({ projectId }) => {
  try {
    const projectObj = Parse.Object.extend("Project");
    const project = new projectObj();
    project.id = projectId;
    project.set("isDeleted", true);
    return await project.save();
  } catch (error) {
    console.log("error", error);
  }
};
