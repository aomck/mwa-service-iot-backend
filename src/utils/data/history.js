import Parse from "../../configs/parse-iot";
import { io } from "../../index";
import axios from "axios";
import { format } from "date-fns";
import th from "date-fns/locale/th";

const getDeviceId = async (code, token) => {
    const deviceQuery = new Parse.Query("Device");
    deviceQuery.equalTo("code", code).equalTo("device_token", token);
    const resp = await deviceQuery.include(["station"]).first();
    return resp;
  };

  const updateDeviceValue = async (payload, code) => {
    const deviceQuery = await new Parse.Query("Device").get(code);
  
    deviceQuery.set("value", payload);
    deviceQuery.set("lasttime_data", new Date());
    return deviceQuery.save();
  };

  const createHistorty = async (payload, code) => {
    const historyObject = Parse.Object.extend("History");
    let history = new historyObject();
    history.set("value", payload);
    history.set("device", code);
    return await history.save();
  };
  