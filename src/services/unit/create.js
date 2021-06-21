import Parse from "../../configs/parse-iot";
import curUserRoleUnit from "../../utils/curUserRoleUnit";
import def from "../../constants/constants";
export default async ({ session, body }) => {
  try {
    let curUser = await curUserRoleUnit(session);
    let userObj = new Parse.Object("Users");
    userObj.id = curUser.objectId;
    const unitObjQuery = Parse.Object.extend("Unit");
    const unitObj = new unitObjQuery();
    for await (const [key, value] of Object.entries(body)) {
      switch (key) {
        case "admins":
          let adminDistinct = [...new Set(value.map((item) => item))];
          let admins = await Promise.all(
            adminDistinct.map(async (id) => {
              const userObj = await new Parse.Query("Users")
                .equalTo("userObjectId", id)
                .first();
              return userObj.id;
            })
          );
          // console.log(admins);
          unitObj.set("admins", admins);
          break;
        case "managers":
          let managerDistinct = [...new Set(value.map((item) => item))];
          let managers = await Promise.all(
            managerDistinct.map(async (id) => {
              const userObj = await new Parse.Query("Users")
                .equalTo("userObjectId", id)
                .first();
              return userObj.id;
            })
          );
          // console.log(managers);
          unitObj.set("managers", managers);
          break;
        case "parent":
          let parentDistinct = [...new Set(value.map((item) => item))];
          unitObj.set("parent", parentDistinct);
          break;
        default:
          unitObj.set(key, value);
          // console.log(key, value);
          break;
      }
    }
    unitObj.set("updatedBy", userObj);
    unitObj.set("createdBy", userObj);
    return unitObj.save();
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
