import Parse from "../../configs/parse-iot";
import curUserRoleUnit from "../../utils/curUserRoleUnit";
import def from "../../constants/constants";
export default async ({ session, unitId }) => {
  try {
    let curUser = await curUserRoleUnit(session);
    let userObj = new Parse.Object("Users");
    userObj.id = curUser.objectId;
    const unitObj = new Parse.Object("Unit");
    unitObj.id = unitId;
    unitObj.set("isDeleted", true);
    unitObj.set("isActive", false);
    unitObj.set("updatedBy", userObj);
    return unitObj.save();
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
