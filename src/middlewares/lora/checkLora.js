import "dotenv/config";
import Parse from "../../configs/parse-iot";

export default async (req, res, next) => {
  try {
    const token = req.headers["lora_token"];
    token ||
      res.status(401).json({
        status: 401,
        message: "unauthorized",
      });
    // console.log("SESSION chekuser ", session);
    const loraDeviceQuery = new Parse.Query("LoraDevice");
    loraDeviceQuery.equalTo("lora_id", req.params.lora_id);
    loraDeviceQuery.equalTo("lora_token", token);
    const result = await loraDeviceQuery.find();
    if (result) {
      console.log("RES checklora res", result);
      next();
    } else {
      res.status(401).json({
        status: 401,
        message: "unauthorized",
      });
    }
  } catch (err) {
    console.log("Get Lora Error : ", err);
    res.status(401).json({
      status: 401,
      message: "unauthorized",
    });
  }
};
