import Parse from "../../configs/parse-iot";

export default async ({ stationId, query }) => {
  try {
    // console.log("Query ::: ", query);

    const stationObj = await new Parse.Query("Station")
      .equalTo("code", stationId)
      .first();

    let stationQuery = new Parse.Query("Device");
    if (query.search) {
      let codeQuery = new Parse.Query("Device");
      codeQuery.matches("code", `.*${query.search}.*`);
      let nameQuery = new Parse.Query("Device");
      nameQuery.matches("name", `.*${query.search}.*`);
      let tagQuery = new Parse.Query("Device");
      tagQuery.matches("tag", query.search);
      stationQuery = Parse.Query.or(codeQuery, nameQuery, tagQuery);
    }
    if (query.template && query.template !== "all") {
      let templateQuery = new Parse.Object("DeviceTemplate");
      templateQuery.id = query.template;
      stationQuery.equalTo("template", templateQuery);
    }

    if (query.isOnline && query.isOnline !== "all") {
      stationQuery.equalTo(
        "isOnline",
        query.isOnline === "true" ? true : false
      );
    }
    const result = await stationQuery
      .equalTo("isActive", true)
      .equalTo("isDeleted", false)
      .equalTo("station", stationObj)
      .include(["station", "template"])
      .withCount()
      .descending("installation_date")
      .find();

    const resultPar = await Promise.all(
      result.results.map(async (d) => {
        let parameter = {};
        let params = await d
          .get("template")
          .relation("parameter")
          .query()
          .include(["display"])
          .find();
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
