import Parse from "../../configs/parse-iot";
import parseUploadFile from "../../helpers/parse_upload_file";

export default async ({ body, file, user_id }) => {
  try {
    const projectObj = Parse.Object.extend("Project");
    const project = new projectObj();

    project.set("createdBy", user_id);
    project.set("updatedBy", user_id);

    if (file?.fieldname && file.fieldname === "icon") {
      project.set("icon", await parseUploadFile({ file }));
    }

    for await (const [key, value] of Object.entries(body)) {
      switch (key) {
        case "isActive":
          project.set(key, value === "true" ? true : false);
          break;
        case "tag":
          if (value === "") {
            project.set(key, []);
          } else {
            project.set(key, value.split(","));
          }
          break;
        case "admin":
          if (value === "") {
            project.set(key, []);
          } else {
            // console.log(">>>>>>>", value.split(",").push(user_id));
            let admin = value.split(",");
            admin.push(user_id);
            console.log("TYPE", typeof admin, typeof xxx);
            project.set(key, admin);
          }
          break;
        case "manager":
          if (value === "") {
            project.set(key, []);
          } else {
            project.set(key, value.split(","));
          }
          break;
        case "viewer":
          if (value === "") {
            project.set(key, []);
          } else {
            project.set(key, value.split(","));
          }
          break;
        default:
          project.set(key, value);
      }
    }
    return await project.save();
  } catch (error) {
    console.log("error", error);
  }
};
