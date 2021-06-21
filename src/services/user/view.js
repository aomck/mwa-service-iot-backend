import Parse from "../../configs/parse-iot";
import axios from "axios";
const CLIENT_API = process.env.CLIENT_API;
export default async ({ session, userId }) => {
  try {
    const userObj = new Parse.Query("Users");
    userObj.equalTo("objectId", userId);
    userObj.include(["role", "unit"]);
    const findUser = await userObj.first();

    if (findUser) {
      const objUser = JSON.parse(JSON.stringify(findUser));
      // console.log("objUser :::", objUser);
      let getProfile = await axios.get(
        `${CLIENT_API}/apis/profile/${objUser.userObjectId}?session=${session}`
      );
      //console.log(getProfile);
      let unitQuery = await findUser
        .relation("units")
        .query()
        .descending("order")
        .find();
      let unit = unitQuery.map((un) => {
        let unObj = JSON.parse(JSON.stringify(un));
        return {
          objectId: unObj.objectId,
          name: unObj.name,
          shortname: unObj.shortname,
        };
      });
      const payload = {
        objectId: objUser.objectId,
        isActive: objUser.isActive,
        position: objUser.position,
        order: objUser.order,
        role: {
          objectId: (objUser.role && objUser.role.objectId) || "",
          name: (objUser.role && objUser.role.name) || "",
          nameTh: (objUser.role && objUser.role.nameTh) || "",
        },
        units: unit,
        title: {
          objectId: getProfile.data.title.objectId,
          fullTitle: getProfile.data.title.fullTitle,
          shortTitle: getProfile.data.title.shortTitle,
        },
        username: getProfile.data.username || "",
        firstName: getProfile.data.firstName || "",
        lastName: getProfile.data.lastName || "",
        email: getProfile.data.email || "",
        tel: getProfile.data.tel || "",
        lineId: getProfile.data.lineId || "",
        profileImg:
          (getProfile.data.profileImg && getProfile.data.profileImg.url) || "",
      };
      return payload;
    }

    return findUser;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
