import axios from "axios";
import "dotenv/config";
const CLIENT_API = process.env.CLIENT_API;
const listRole = [
  "Maholan Super User",
  "Maholan Admin",
  "Client Admin",
  "Client Viewer",
  "Checkyod Admin",
  "Checkyod Viewer",
];
export default async (req, res, next) => {
  try {
    const session = req.headers["session_token"];
    session ||
      res.status(401).json({
        status: 401,
        message: "unauthorized",
      });
    // console.log("SESSION ", session);
    let roles = await axios.get(
      CLIENT_API + "/apis/checkRole?session=" + session
    );

    for (var i = 0; i < roles.data.length; i++) {
      if (listRole.includes(roles.data[i])) {
        next();
        break;
      } else {
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
