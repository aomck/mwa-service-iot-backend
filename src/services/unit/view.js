import Parse from "../../configs/parse-iot";
import curUserRoleUnit from "../../utils/curUserRoleUnit";
import def from "../../constants/constants";
import axios from "axios";
const CLIENT_API = process.env.CLIENT_API;
const FILES_SERVER = process.env.FILES_SERVER;
export default async ({ session, unitId }) => {
  try {
    const unitObj = await new Parse.Query("Unit").get(unitId);
    const unitParse = JSON.parse(JSON.stringify(unitObj));
    let shortName = await Promise.all(
      unitParse.parent.map(async (u) => {
        const parentQuey = await new Parse.Query("Unit").get(u);
        return {
          objectId: u,
          order: parentQuey.get("order"),
          name: parentQuey.get("name"),
          shortname: parentQuey.get("shortname"),
        };
      })
    );
    let admins = [];
    let admin = await Promise.all(
      unitParse.admins.map(async (u) => {
        const objUser = await new Parse.Query("Users").get(u);
        const getProfile = await axios.get(
          `${CLIENT_API}/apis/profile/${objUser.get(
            "userObjectId"
          )}?session=${session}`
        );
        admins.push(
          getProfile &&
            ((getProfile.data.title && getProfile.data.title.shortTitle) ||
              "") +
              getProfile.data.firstName +
              " " +
              getProfile.data.lastName
        );
        return {
          objectId: u,
          userObjectId: objUser.get("userObjectId"),
          name:
            getProfile &&
            ((getProfile.data.title && getProfile.data.title.shortTitle) ||
              "") +
              getProfile.data.firstName +
              " " +
              getProfile.data.lastName,
        };
      })
    );
    let managers = [];
    let manager = await Promise.all(
      unitParse.managers.map(async (u) => {
        const objUser = await new Parse.Query("Users").get(u);
        const getProfile = await axios.get(
          `${CLIENT_API}/apis/profile/${objUser.get(
            "userObjectId"
          )}?session=${session}`
        );
        managers.push(
          getProfile &&
            ((getProfile.data.title && getProfile.data.title.shortTitle) ||
              "") +
              getProfile.data.firstName +
              " " +
              getProfile.data.lastName
        );
        return {
          objectId: u,
          userObjectId: objUser.get("userObjectId"),
          name:
            getProfile &&
            ((getProfile.data.title && getProfile.data.title.shortTitle) ||
              "") +
              getProfile.data.firstName +
              " " +
              getProfile.data.lastName,
        };
      })
    );
    shortName.sort(function (a, b) {
      return b.order - a.order;
    });
    const shortnames = shortName.map((n) => {
      return n.name;
    });
    const result = {
      ...unitParse,
      parents: shortName,
      admin: admin,
      manager: manager,
      parent: shortnames,
      admins: admins,
      managers: managers,
    };
    return result;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
