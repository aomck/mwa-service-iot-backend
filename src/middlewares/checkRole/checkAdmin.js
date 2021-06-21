import Parse from "../../configs/parse-iot";
import axios from "axios";
import "dotenv/config";
import def from "../../constants/constants";
const CLIENT_API = process.env.CLIENT_API;
const listRole = [
  def.role.staff,
  def.role.manager,
  def.role.inspector,
  def.role.admin,
  def.role.superAdmin,
];

export default async (req, res, next) => {
  try {
    //console.log("CCCCCC ADMIN");
    const session = req.headers["session_token"];
    let userId = await axios.get(
      CLIENT_API + "/apis/session?session=" + session
    );
    //console.log("USER Obj ID", userId.data);
    let query = new Parse.Query("Users");
    query.equalTo("userObjectId", userId.data);
    let user = await query.first({ useMasterKey: true });
    let objRole = user.get("Role");
    let queryRole = new Parse.Query("_Role");
    queryRole.equalTo("objectId", objRole.id);
    let role = await queryRole.first({ useMasterKey: true });
    //let roleName = role.get("name");
    if (listRole.includes(role.get("name"))) {
      next();
    } else if (i + 1 == role.length) {
      res.status(401).json({
        status: 401,
        message: "unauthorized",
      });
    }
  } catch (error) {
    // console.log("error", error);
    res.status(401).json({
      status: 401,
      message: "unauthorized",
    });
  }
};
