import Parse from "../configs/parse-iot";
import parseUploadFile from "../helpers/parse_upload_file";

export default async ({ query }) => {
  try {
    console.log("==> Query", query);
    const queryRes = await new Parse.Query(query.db)
      .equalTo("key", query.key)
      .first();
    // console.log("...", queryRes);
    if (queryRes) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("error", error);
  }
};
