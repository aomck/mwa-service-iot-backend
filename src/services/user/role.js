import Parse from "../../configs/parse-iot";
import axios from "axios";
import curUserRoleUnit from "../../utils/curUserRoleUnit";
const CLIENT_API = process.env.CLIENT_API;
export default async ({ session }) => {
  try {
    const user = await curUserRoleUnit(session);
    return user;
  } catch (error) {
    console.log("error ccc", error);
    throw error;
  }
};
