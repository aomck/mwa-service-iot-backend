import Parse from "../../configs/parse-iot";
import axios from "axios";
const CLIENT_API = process.env.CLIENT_API;
const FILES_SERVER = process.env.FILES_SERVER;
const fetch = require("node-fetch");
export default async ({ session, userId }) => {
  try {
    // console.log("USER ID", userId);
    if (userId !== "undefined") {
      const userObj = new Parse.Query("Users");
      userObj.equalTo("objectId", userId);
      const findUser = await userObj.first();

      const objUser = JSON.parse(JSON.stringify(findUser));
      let getProfile = await fetch(
        `${CLIENT_API}/apis/profileimg/${objUser.userObjectId}`
      );
      const buffer = await getProfile.buffer();
      return buffer;
    }
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
