import Parse from "../../configs/parse-iot";
import axios from "axios";
const CLIENT_API = process.env.CLIENT_API;
const FILES_SERVER = process.env.FILES_SERVER;
export default async ({ session, mainUserId }) => {
  try {
    // console.log("USER ID", userId);
    if (mainUserId === "undefined") {
      return "ไม่รู้จัก";
    }
    const userObj = new Parse.Query("Users");
    userObj.equalTo("userObjectId", mainUserId);
    userObj.include(["role", "role.User", "units", "contractor"]);
    const findUser = await userObj.first();

    if (findUser) {
      const objUser = JSON.parse(JSON.stringify(findUser));
      // console.log("objUser :::", objUser);
      let getProfile = await axios.get(
        `${CLIENT_API}/apis/profile/${objUser.userObjectId}?session=${session}`
      );
      // console.log("getProfile :::", getProfile.data);
      let unitQuery = await findUser
        .relation("units")
        .query()
        .descending("order")
        .find();
      let unitList = await Promise.all(
        unitQuery.map((un) => {
          let unObj = JSON.parse(JSON.stringify(un));
          return {
            objectId: unObj.objectId,
            name: unObj.name,
            shortname: unObj.shortname,
          };
        })
      );
      const payload = {
        objectId: objUser.objectId,
        userObjectId: objUser.userObjectId,
        type: objUser.type,
        position: objUser.position,
        role: {
          objectId: (objUser.role && objUser.role.objectId) || "",
          name: (objUser.role && objUser.role.name) || "",
          nameTh: (objUser.role && objUser.role.nameTh) || "",
        },
        units: unitList,
        contractor: {
          objectId: (objUser.contractor && objUser.contractor.objectId) || "",
          name: (objUser.contractor && objUser.contractor.name) || "",
        },
        title: getProfile.data.title && getProfile.data.title,
        username: getProfile.data.username || "",
        firstName: getProfile.data.firstName || "",
        lastName: getProfile.data.lastName || "",
        email: getProfile.data.email || "",
        tel: getProfile.data.tel || "",
        lineId: getProfile.data.lineId || "",
        profileImg:
          (getProfile.data.profileImg && getProfile.data.profileImg.url) ||
          FILES_SERVER + "/images/public/profile_null.jpg",
      };
      return payload;
    }

    return findUser;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
