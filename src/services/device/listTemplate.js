import Parse from "../../configs/parse-iot";

export default async () => {
  try {
    const query = new Parse.Query("DeviceTemplate");
    query.equalTo("isDeleted", false);
    query.equalTo("isActive", true);
    const findDeviceTemplate = await query.find();
    const listDeviceTemplate = await Promise.all(
      findDeviceTemplate.map(async (devicetemplate) => {
        let viewDevicetemplate = JSON.parse(JSON.stringify(devicetemplate));
        const relationParameter = await devicetemplate
          .relation("parameter")
          .query()
          .includeAll()
          .find();
        return {
          ...viewDevicetemplate,
          parameter: relationParameter,
        };
      })
    );
    return listDeviceTemplate;
  } catch (error) {
    console.log("error", error);
  }
};
