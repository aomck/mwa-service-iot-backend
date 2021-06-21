import Parse from "../../configs/parse-iot";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import def from "../../constants/constants";
import curUserRoleUnit from "../../utils/curUserRoleUnit";
const CLIENT_API = process.env.CLIENT_API;
export default async ({ body, session }) => {
  try {
    const rolequery = await new Parse.Query("_Role").get(body.role.objectId);
    const create = await axios.post(
      `${CLIENT_API}/apis/admin/user?session=${session}`,
      {
        username: body.username,
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
      }
    );
    if (create.data.message) {
      return create.data;
    } else {
      // console.log(create.data);
      // userQuery.equalTo("userObjectId", curUser.userObjectId);
      // const createdUser = await userQuery.first();
      const userObj = Parse.Object.extend("Users");
      const createUser = new userObj();
      const curUser = await curUserRoleUnit(session);
      createUser.set("userObjectId", create.data.objectId);
      for await (const [key, value] of Object.entries(body)) {
        switch (key) {
          case "username":
            createUser.set("username", value);
            break;
          case "unit":
            for (let i in value) {
              let unit = await new Parse.Query("Unit").get(value[i]);
              createUser.relation("units").add(unit);
            }
            createUser.set("unit", value);
            break;
          case "role":
            createUser.set("role", rolequery);
            break;
          case "position":
            createUser.set("position", value);
            break;
          case "isActive":
            createUser.set("isActive", value);
            break;
          case "order":
            createUser.set("order", parseInt(value));
            break;
        }
      }

      const createdBy = await new Parse.Query("Users").get(curUser.objectId);
      createUser.set("createdBy", createdBy);
      createUser.set("updatedBy", createdBy);
      let result = await createUser.save();
      return result;
    }
  } catch (error) {
    console.log("error ::::", error);
    throw error;
  }
};
