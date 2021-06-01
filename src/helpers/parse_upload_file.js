import Parse from "../configs/parse-iot";
import { uuid } from "uuidv4";

const parseUploadFile = async ({ file }) => {
  try {
    const encoded = file.buffer.toString("base64");
    const nameFile = `${uuid()}`;
    const fileParse = new Parse.File(
      nameFile,
      {
        base64: encoded,
      },
      file.mimetype
    );
    return fileParse;
  } catch (error) {
    console.log("error parseUploadFile parseUploadFile parseUploadFile", error);
  }
};

export default parseUploadFile;
