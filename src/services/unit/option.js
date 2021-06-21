import Parse from "../../configs/parse-iot";
import curUserRoleUnit from "../../utils/curUserRoleUnit";
import def from "../../constants/constants";
export default async ({ session, query }) => {
  try {
    let query = new Parse.Query("Unit");
    let curUser = await curUserRoleUnit(session);
    let curUserObj = new Parse.Object("Users");
    curUserObj.id = curUser.objectId;
    if (curUser.role.name !== def.role.superAdmin) {
      // if (curUser.role.name === def.role.admin) {
      if (curUser.role) {
        let unitList = [];
        await Promise.all(
          curUser.unit.map(async (u) => {
            // console.log("unit id :::", u.objectId);
            let checkUnitManager = new Parse.Query("Unit")
              .equalTo("objectId", u.objectId)
              .equalTo("managers", curUser.objectId);
            let checkUnitAdmin = new Parse.Query("Unit")
              .equalTo("objectId", u.objectId)
              .equalTo("admins", curUser.objectId);
            let checkUnitPerm = await Parse.Query.or(
              checkUnitAdmin,
              checkUnitManager
            )
              .ascending("order")
              .first();
            //checkUnitPerm = unit ที่คนนี้สังกัดอยู่และเป็น admin หรือ manager
            if (checkUnitPerm) {
              let curChild = await new Parse.Query("Unit")
                .equalTo("parent", checkUnitPerm.id)
                .find();
              await Promise.all(
                curChild.map(async (un) => {
                  if (!unitList.some((e) => e.objectId === un.id)) {
                    unitList.push({
                      order: un.get("order"),
                      objectId: un.id,
                      name: un.get("name"),
                      shortname: un.get("shortname"),
                    });
                  }
                })
              );
              if (!unitList.some((e) => e.objectId === checkUnitPerm.id)) {
                unitList.push({
                  order: checkUnitPerm.get("order"),
                  objectId: checkUnitPerm.id,
                  name: checkUnitPerm.get("name"),
                  shortname: checkUnitPerm.get("shortname"),
                });
              }
            }
          })
        );
        unitList.sort(function (a, b) {
          return a.order - b.order;
        });
        return unitList;
      } else {
        return {
          status: 401,
          message: "unauthorized",
        };
      }
    }
    return role;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
