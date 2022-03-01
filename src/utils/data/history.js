import Parse from "../../configs/parse-iot";

export const getDeviceId = async (code) => {
  const deviceQuery = new Parse.Query("Device");
  deviceQuery.equalTo("code", code);
  const resp = await deviceQuery.include(["station"]).first();
  return resp;
};

export const updateDeviceValue = async (payload, device) => {
  const old_value = device.get("value");
  const new_value = { ...old_value, ...payload };
  device.set("value", new_value);
  device.set("lasttime_data", new Date());
  return device.save();
};

export const createHistorty = async (payload, device) => {
  const historyObject = Parse.Object.extend("History");
  let history = new historyObject();
  history.set("value", payload);
  history.set("device", device);
  return history.save();
};
