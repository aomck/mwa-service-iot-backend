import Parse from "../../configs/parse-iot";

export default async ({ stationId }) => {
  try {
    const stationObj = await new Parse.Query("Station")
      .equalTo("code", stationId)
      .first();

    const stationQuery = new Parse.Query("Device");
    const result = await stationQuery
      .equalTo("isActive", true)
      .equalTo("isDeleted", false)
      .equalTo("station", stationObj)
      .include(["station","template"])
      .withCount()
      .find();


    const resultPar = await Promise.all(
      result.results.map(async (d) => {
        let parameter = {};
        let params = await d.get("template").relation("parameter").query().find();
        await params.map((p) => {
          parameter[p.get("key")] = p;
        });
        return {
          ...JSON.parse(JSON.stringify(d)),
          parameter: parameter,
        };
      })
    );

    const response = {
      data: { count: result.count, results: resultPar },
      station: stationObj,
    };
    // console.log("XXXXX", result);
    return response;
  } catch (error) {
    console.log("error", error);
  }
};
