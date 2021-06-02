import Parse from "../../configs/parse-iot";
import parseUploadFile from "../../helpers/parse_upload_file";

export default async ({ body, file }) => {
  try {
    const userObj = new Parse.Query("Users");

    const findUser = await userObj
      .equalTo("objectId", "hx1YnEMwKl")
      .includeAll()
      .first();

    const projectObj = Parse.Object.extend("Project");
    const project = new projectObj();

    project.set("createdBy", findUser);
    if (file?.fieldname && file.fieldname === "icon") {
      project.set("icon", await parseUploadFile({ file }));
    }
    for await (const [key, value] of Object.entries(body)) {
      switch (key) {
        // case "":
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
