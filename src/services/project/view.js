import Parse from "../../configs/parse-iot";
import "dotenv/config";
const CLIENT_API = process.env.CLIENT_API;

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
