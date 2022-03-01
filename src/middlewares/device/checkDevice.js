import "dotenv/config";
import Parse from "../../configs/parse-iot";

export default async (req, res, next) => {
  try {
    const token = req.headers["device_token"];
    token ||
      res.status(401).json({
        status: 401,
        message: "unauthorized",
      });
    // console.log("SESSION chekuser ", session);
    const deviceQuery = new Parse.Query("Device");
    // console.log("::::", req.params?.device_id);
    deviceQuery.equalTo("code", req.params?.device_code);
    deviceQuery.equalTo("device_token", token);
    const result = await deviceQuery.find();
    if (result.length > 0) {
      // console.log("RES check device res", result);
      // console.log("........................");
      req.device_code = req.params?.device_code;
      req.device_token = token;
      next();
    } else {
      res.status(401).json({
        status: 401,
        message: "unauthorized",
      });
    }
  } catch (err) {
    console.log("Get Device Error : ", err);
    res.status(401).json({
      status: 401,
      message: "unauthorized",
    });
  }
};
