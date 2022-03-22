import Parse from "../../configs/parse-iot";
import parseUploadFile from "../../helpers/parse_upload_file";

export default async ({ body,files, user_id }) => {
  try {
    // console.log("parameter ID ===> ", parameterId);
    // console.log("Body ===> ", body);
    // console.log("FILE ===> ", files);
    const parameterObj = Parse.Object.extend("Parameter");
    const parameter = new parameterObj();
    parameter.set("updatedBy", user_id);
    parameter.set("createdBy", user_id);
    body.isActive = true;

    if (files && files.length > 0) {
      files.map(async (file) => {
        parameter.set(file.originalname, await parseUploadFile({ file }));
      });
    }

    for await (const [key, value] of Object.entries(body)) {
      switch (key) {
        case "isActive":
          parameter.set(key, value === "true" ? true : false);
          break;
        case "isNotification":
          parameter.set(key, value === "true" ? true : false);
          break;
        case "tag":
          if (value === "") {
            parameter.set(key, []);
          } else {
            parameter.set(key, value.split(","));
          }
          break;
        case "min":
          parameter.set(key, parseInt(value));
          break;
        case "max":
          parameter.set(key, parseInt(value));
          break;
        case "display":
          const displayObj = new Parse.Object("DisplayType");
          displayObj.id = JSON.parse(value).objectId;
          // console.log(displayObj);
          parameter.set(key, displayObj);
          break;
        case "index":
          parameter.set(key, JSON.parse(value));
          break;
        default:
          parameter.set(key, value);
          break;
      }
    }
    return await parameter.save();
  } catch (error) {
    console.log("error", error);
  }
};
