import Parse from "../../configs/parse-iot";
import axios from "axios";
import curUserRoleUnit from "../../utils/curUserRoleUnit";

const CLIENT_API = process.env.CLIENT_API;
const FILES_SERVER = process.env.FILES_SERVER;
export default async ({ session, query }) => {
  try {
    // console.log("CCCC  ", query);
    const userObj = new Parse.Query("Users");
    const queryUnit = new Parse.Query("Unit");
    const queryContractor = new Parse.Query("Contractor");
    const findRole = await new Parse.Query("_Role")
      .equalTo("name", query.role)
      .first();
    let curUser = await curUserRoleUnit(session);
    if (
      curUser.role.name !== "Super Admin" &&
      !query.unit &&
      !query.contractor
    ) {
      userObj.equalTo("unit", await queryUnit.get(curUser.unit.objectId));
    }
    userObj
      .include(["Role", "Role.User", "unit", "createdBy", "contractor"])
      .equalTo("isDeleted", false)
      .equalTo("Role", findRole)
      .ascending("createdAt");
    if (query.unit) {
      userObj.equalTo("unit", await queryUnit.get(query.unit));
    }
    if (query.contractor) {
      userObj.equalTo(
        "contractor",
        await queryContractor.get(query.contractor)
      );
    }

    const findUser = await userObj.find();
    const objUser = JSON.parse(JSON.stringify(findUser));
    // if (Object.keys(query).length === 0) {
    const mapRelation = objUser.map(async (user) => {
      let getProfile = await axios.get(
        `${CLIENT_API}/apis/profile/${user.userObjectId}?session=${session}`
      );
      const payload = {
        objectId: user.objectId,
        type: user.type,
        username: getProfile.data.username,
        firstName: getProfile.data.firstName,
        lastName: getProfile.data.lastName,
        profileImg: getProfile.data.profileImg
          ? getProfile.data.profileImg.url
          : FILES_SERVER + "/images/public/profile_null.jpg",
        tel: getProfile.data.tel,
        lineId: getProfile.data.lineId,
        email: getProfile.data.email,
        role: user.Role.nameTh,
        unit: user.unit ? user.unit.name : "",
        contractor: user.contractor ? user.contractor.name : "",
        jobPosition: user.jobPosition ? user.jobPosition : "",
        createdAt: user.createdAt,
      };

      return payload;
    });

    const list = await Promise.all(mapRelation);
    return list;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
