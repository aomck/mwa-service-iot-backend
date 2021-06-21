import Parse from "../../configs/parse-iot";
import axios from "axios";
import "dotenv/config";
const CLIENT_API = process.env.CLIENT_API;

export default async (req, res, next) => {
  try {
    const session = req.headers["cia_token"];

    let query = new Parse.Query("CIA");
    query.equalTo("cia_token", session);
    let cia = await query.first();
    if (cia) {
      next();
    } else {
      console.log("unauthorized");
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
