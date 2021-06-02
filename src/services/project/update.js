import Parse from "../../configs/parse-iot";
import parseUploadFile from "../../helpers/parse_upload_file";

export default async ({ body, projectId, file }) => {
  try {
    const userObj = new Parse.Query("Users");

    const findUser = await userObj
      .equalTo("objectId", "hx1YnEMwKl")
      .includeAll()
      .first();
    // console.log("findUser :::", findUser);
    const projectObj = Parse.Object.extend("Project");
    const project = new projectObj();
    project.id = projectId;
    project.set("updatedBy", findUser);

    if (file?.fieldname && file.fieldname === "icon") {
      project.set("icon", await parseUploadFile({ file }));
    }

    for await (const [key, value] of Object.entries(body)) {
      switch (key) {
        // case "icon":

        //   break;
        default:
          project.set(key, value);
      }
    }
    return await project.save();
  } catch (error) {
    console.log("error", error);
  }
};
