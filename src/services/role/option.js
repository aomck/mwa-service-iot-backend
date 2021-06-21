import Parse from "../../configs/parse-iot";
import curUserRoleUnit from "../../utils/curUserRoleUnit";
import def from "../../constants/constants";
export default async ({ session }) => {
  try {
    let query = new Parse.Query("_Role");
    let curRole = await curUserRoleUnit(session);
    if (curRole.role.name !== def.role.superAdmin) {
      query.notEqualTo("name", def.role.superAdmin);
    }
    let role = await query.find();

    if (role.length !== 0) {
      role = role.map((val) => {
        return {
          objectId: val.id,
          name: val.attributes.name || "",
          nameTh: val.attributes.nameTh || "",
        };
      });
    }

    return role;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
