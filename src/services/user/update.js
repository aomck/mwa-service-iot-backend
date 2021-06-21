import Parse from "../../configs/parse-iot";
import axios from "axios";
import def from "../../constants/constants";
import curUserRoleUnit from "../../utils/curUserRoleUnit";
import { updateRelation } from "../../utils/parseRemoveRalation";
const CLIENT_API = process.env.CLIENT_API;
export default async ({ session, body, userId }) => {
  try {
    // console.log("userData ::::: ", body);
    const curUser = await curUserRoleUnit(session);
    const findUserUpdate = await new Parse.Query("Users") // update User
      .equalTo("objectId", userId)
      .include("units", "role")
      .first();
    const rolequery = await new Parse.Query("_Role").get(body.role.objectId);
    let userData = {
      password: body.password || "",
      firstName: body.firstName || "",
      lastName: body.lastName || "",
      email: body.email || "",
      tel: body.tel || "",
      lineId: body.lineId || "",
      roles:
        rolequery.attributes.name !== def.role.admin &&
        rolequery.attributes.name !== def.role.superAdmin
          ? def.mainRoleObjectId.checkyodViewer
          : def.mainRoleObjectId.checkyodAdmin,
      title: body.title,
    };

    if (
      userData.password === undefined ||
      userData.password === null ||
      userData.password === ""
    ) {
      delete userData.password;
    }

    const update = await axios.put(
      `${CLIENT_API}/apis/updateProfileUser/${findUserUpdate.get(
        "userObjectId"
      )}?session=${session}`,
      userData
    );
    // console.log("update,", update.data);
    if (update.data.message) {
      console.log("ERRRROR");
      return update.data;
    }
    for await (const [key, value] of Object.entries(body)) {
      switch (key) {
        case "unit":
          let delItem = await updateRelation({
            baseClassName: "Users",
            id: userId,
            nameRelation: "units",
            subClassName: "Unit",
            itemIds: value,
          });
          findUserUpdate.set("unit", value);
          break;
        case "role":
          findUserUpdate.set("role", rolequery);
          break;
        case "position":
          findUserUpdate.set("position", value);
          break;
        case "isActive":
          findUserUpdate.set("isActive", value);
          break;
        case "order":
          findUserUpdate.set("order", parseInt(value));
          break;
      }
    }
    const updatedBy = await new Parse.Query("Users").get(curUser.objectId);
    findUserUpdate.set("updatedBy", updatedBy);
    let result = await findUserUpdate.save();
    return result;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
