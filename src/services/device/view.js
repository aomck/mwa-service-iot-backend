import Parse from "../../configs/parse-iot";

export default async ({ deviceId }) => {
  try {
    let query = await new Parse.Query("Device").get(deviceId);
    let value = {};
    for (const [key] of Object.entries(query.attributes.value)) {
      console.log(`${key}`);
      const respData = await getParameter(key);
      value[key] = respData;
    }

    let result = {
      ...JSON.parse(JSON.stringify(query)),
      value,
    };

    return result;
  } catch (error) {
    console.log("error", error);
  }
};

const getParameter = async (key) => {
  const query = await new Parse.Query("Parameter")
    .equalTo("key", key)
    .select("max", "color", "nameTh", "unit", "icon")
    .first();
  return query;
};
