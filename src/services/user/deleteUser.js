import Parse from "../../configs/parse-iot";
import axios from "axios";
const CLIENT_API = process.env.CLIENT_API;
export default async ({ session, body, userId }) => {
  try {
    const userProfile = await axios.get(
      `${CLIENT_API}/apis/session?session=${session}`
    );
    //console.log("=====", userProfile.data);

    const userObj = await new Parse.Query("Users")
      .equalTo("userObjectId", userProfile.data)
      .include("contractor.Contractor", "unit", "Role")
      .first();

    const findUserUpdate = await new Parse.Query("Users")
      .equalTo("objectId", userId)
      .include("contractor.Contractor", "unit", "Role")
      .first();
    // console.log("=====", findUserUpdate);
    if (
      findUserUpdate.attributes.unit &&
      findUserUpdate.attributes.unit.id !== userObj.attributes.unit.id &&
      JSON.parse(JSON.stringify(userObj)).Role.name !== "Super Admin"
    ) {
      return undefined;
    }
    const update = await axios.put(
      `${CLIENT_API}/apis/updateProfileUser/${findUserUpdate.get(
        "userObjectId"
      )}?session=${session}`,
      { isDeleted: true }
    );
    // console.log("update,", update);
    if (update.data.message) {
      return update.data;
    }

    findUserUpdate.set("isDeleted", true);
    let result = await findUserUpdate.save();
    return result;
  } catch (error) {
    console.log("error", erorr);
    throw error;
  }
};
