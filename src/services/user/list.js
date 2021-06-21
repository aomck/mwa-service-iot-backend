import Parse from "../../configs/parse-iot";
import axios from "axios";
import curUserRoleUnit from "../../utils/curUserRoleUnit";
import def from "../../constants/constants";
import fs from "fs";
const dir = "./images/train-images/";
const CLIENT_API = process.env.CLIENT_API;
const FILES_SERVER = process.env.FILES_SERVER;
export default async ({ session, query }) => {
  try {
    const curUser = await curUserRoleUnit(session);
    const userObj = new Parse.Query("Users");
    let unitPerm;
    if (curUser.role.name !== def.role.superAdmin) {
      const unitAdmin = new Parse.Query("Unit").equalTo(
        "admins",
        curUser.objectId
      );
      const unitManager = new Parse.Query("Unit").equalTo(
        "managers",
        curUser.objectId
      );
      unitPerm = Parse.Query.or(unitAdmin, unitManager).descending("order");
      // .find();
      // เป็น Admin หรือ Manger ของ unit ใดหรือไม่
      userObj.matchesQuery("units", unitPerm);
      //return unitPerm;
    }

    const setResponse = async (parseQuery) => {
      const resultQuery = await parseQuery
        .include(["role", "createdBy", "updatedBy"])
        .equalTo("isDeleted", false)
        .limit(100)
        .withCount()
        .descending("createdAt")
        .find();
      const userList = await Promise.all(
        resultQuery.results.map(async (u) => {
          const user = JSON.parse(JSON.stringify(u));
          let getProfile = await axios.get(
            `${CLIENT_API}/apis/profile/${user.userObjectId}?session=${session}`
          );
          // console.log("NNNN", user);
          let unitQuery = await u
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
          let image = false;
          if (fs.existsSync(dir + user.objectId)) {
            let files = fs.readdirSync(dir + user.objectId);
            if (files.length !== 0) {
              image = true;
            }
          }
          return {
            ...user,
            train: user.isTrain,
            image: image,
            title: getProfile.data.title && getProfile.data.title,
            firstName: getProfile.data.firstName || "",
            lastName: getProfile.data.lastName || "",
            tel: getProfile.data.tel,
            lineId: getProfile.data.lineId,
            email: getProfile.data.email,
            createdBy: {
              objectId: user.createdBy.objectId,
              userObjectId:
                (user.createdBy.userObjectId && user.createdBy.userObjectId) ||
                user.userObjectId,
            },
            updatedBy: {
              objectId: user.updatedBy.objectId,
              userObjectId:
                (user.updatedBy.userObjectId && user.updatedBy.userObjectId) ||
                user.userObjectId,
            },
            role: {
              objectId: user.role.objectId,
              name: user.role.name,
              nameTh: user.role.nameTh,
            },
            units: unit,
          };
        })
      );

      return { count: resultQuery.count, results: userList };
    };

    for (const [key, value] of Object.entries(query)) {
      switch (key) {
        case "search":
          if (value !== undefined || value !== "") {
            const encodeValue = encodeURI(value);
            let reqeust = await axios.get(
              `${CLIENT_API}/apis/search?by=name&search=${encodeValue}`
            );
            let listUser = reqeust.data;
            let listUserQuery = listUser.map((o) => {
              return new Parse.Query("Users")
                .equalTo("userObjectId", o)
                .matchesQuery("units", unitPerm);
            });

            var queryByName = Parse.Query.or(...listUserQuery);
            return await setResponse(queryByName);
          }
          break;
        case "startDate":
          userObj.greaterThanOrEqualTo("createdAt", new Date(value));
          break;
        case "endDate":
          userObj.lessThan("createdAt", new Date(value));
          break;
        case "role":
          const roleObj = new Parse.Query("_Role");
          userObj.equalTo("role", await roleObj.get(value));
          break;
        case "unit":
          const unitObj = new Parse.Query("Unit");
          userObj.equalTo("units", await unitObj.get(value));
          break;
        case "title":
          if (value !== undefined || value !== "") {
            const encodeValue = encodeURI(value);
            let reqeust = await axios.get(
              `${CLIENT_API}/apis/search?by=title&search=${encodeValue}`
            );
            let listUser = reqeust.data;
            let listUserQuery = listUser.map((o) => {
              return new Parse.Query("Users")
                .equalTo("userObjectId", o)
                .matchesQuery("units", unitPerm);
            });

            var queryByName = Parse.Query.or(...listUserQuery);
            return await setResponse(queryByName);
          }
          break;
        default:
          userObj.equalTo(key, value);
      }
    }

    return await setResponse(userObj);
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
