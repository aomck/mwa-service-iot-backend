import Parse from "../configs/parse-iot";
import axios from "axios";
const CLIENT_API = process.env.CLIENT_API;
export default async (session) => {
  try {
    const userObj = new Parse.Query("Users");
    // console.log("SESSSS ",session)
    const userProfile = await axios.get(
      `${CLIENT_API}/apis/session?session=${session}`
    );
    console.log("profile Data", userProfile.data);
    const findUser = await userObj
      .equalTo("userObjectId", userProfile.data)
      .include(["role"])
      .select(["role.name", "unit"])
      .first();

    const curUser = JSON.parse(JSON.stringify(findUser));
    const unitQuery = new Parse.Query("Unit");
    const unit = await Promise.all(
      curUser.unit.map(async (u) => {
        const resUnit = await unitQuery
          .equalTo("objectId", u)
          .include(["name", "shortname"])
          .select(["name", "shortname"])
          .first();
        const parseUnit = JSON.parse(JSON.stringify(resUnit));
        const unitObj = {
          objectId: parseUnit.objectId,
          name: parseUnit.name,
          shortname: parseUnit.shortname,
        };
        return unitObj;
      })
    );

    const objUser = JSON.parse(JSON.stringify(findUser));
    const user = {
      objectId: objUser.objectId,
      userObjectId: userProfile.data,
      role: { objectId: objUser.role.objectId, name: objUser.role.name },
      unit: unit,
    };
    return user;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
