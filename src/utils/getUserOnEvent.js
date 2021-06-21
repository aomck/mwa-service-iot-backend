import Parse from "../configs/parse-iot";
import axios from "axios";
const CLIENT_API = process.env.CLIENT_API;
export default async (eventId) => {
  try {
    const query = await new Parse.Query("Event")
      .equalTo("objectId", "RqEVBgT20j")
      .first();

    const inviteUnitUserQuery = query.attributes.inviteUnits.map((unitId) => {
      return new Parse.Query("Users").equalTo("unit", unitId);
    });
    const exceptUnitUserQuery = query.attributes.exceptUnits.map((unitId) => {
      return new Parse.Query("Users").notEqualTo("unit", unitId);
    });
    const exceptUser = query.attributes.exceptUsers.map((userId) => {
      return new Parse.Query("Users").notEqualTo("objectId", userId);
    });
    const inviteUser = query.attributes.inviteUsers.map((userId) => {
      return new Parse.Query("Users").equalTo("objectId", userId);
    });

    const inUserUnit =
      (inviteUnitUserQuery.length > 0 &&
        Parse.Query.or(...inviteUnitUserQuery)) ||
      undefined;

    const exUserUnit =
      (exceptUnitUserQuery.length > 0 &&
        Parse.Query.or(...exceptUnitUserQuery)) ||
      undefined;
    // console.log(exUserUnit);
    const exUser =
      (exceptUser.length > 0 && Parse.Query.or(...exceptUser)) || undefined;
    // console.log(exceptUser);
    const allQuery = [inUserUnit, exUserUnit, exUser];
    const mergeQuery = allQuery.filter((item) => item !== undefined);
    const andQuery = Parse.Query.and(...mergeQuery);
    // console.log(andQuery)
    const resultQuery = await Parse.Query.or(andQuery, ...inviteUser).find();
    // console.log(resultQuery);
    const listUserObjId = resultQuery.map((u) => u.id);
    return listUserObjId;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
