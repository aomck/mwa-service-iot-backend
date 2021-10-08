import axios from "axios";
import "dotenv/config";
import def from "../../constants/defination";
const CLIENT_API = process.env.CLIENT_API;
const listRole = [
  def.role.maholan_super_user,
  def.role.maholan_admin,
  def.role.client_admin,
  def.role.client_viewer,
  def.role.iot_super_admin,
  def.role.iot_admin,
  def.role.iot_manager,
  def.role.iot_viewer,
  def.role.iot_user,
];
export default async (req, res, next) => {
  try {
    const session = req.headers["session_token"];
    session ||
      res.status(401).json({
        status: 401,
        message: "unauthorized",
      });
    // console.log("SESSION chekuser ", session);
    let result = await axios.get(CLIENT_API + "/apis/checkroleobj", {
      headers: {
        "session-token": session,
      },
    });
    // console.log("ROLES :::: ", result.data);

    for (var i = 0; i < result.data.roles.length; i++) {
      // console.log(">>", roles.data[i]);
      if (listRole.includes(result.data.roles[i])) {
        // console.log("NEXT :: ", result.data.user_id);
        req.user_id = result.data.user_id;
        next();
        break;
      } else if (i + 1 === result.data.roles.length) {
        res.status(401).json({
          status: 401,
          message: "unauthorized",
        });
        break;
      }
    }
  } catch (err) {
    console.log("Get CheckRole Error : ", err);
    res.status(401).json({
      status: 401,
      message: "unauthorized",
    });
  }
};
