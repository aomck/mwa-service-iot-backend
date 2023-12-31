import Parse from "../../configs/parse-iot";

export default async ({ deviceId, query }) => {
  try {
    const historyQuery = new Parse.Query("History");
    historyQuery.descending("createdAt");
    // query.includeAll("*");
    historyQuery.select("value");
    historyQuery.limit(await historyQuery.count());

    console.log("  new Date(parseInt(query.startDate)) ::", query.startDate);

    // query?.startDate &&
    //   historyQuery.greaterThanOrEqualTo(
    //     "createdAt",
    //     new Date(parseInt(query.startDate))
    //   );
    query?.startDate &&
      historyQuery.greaterThanOrEqualTo("createdAt", new Date(query.startDate));

    // query?.endDate &&
    //   historyQuery.lessThanOrEqualTo(
    //     "createdAt",
    //     new Date(parseInt(query.endDate))
    //   );

    query?.endDate &&
      historyQuery.lessThanOrEqualTo("createdAt", new Date(query.endDate));

    historyQuery.equalTo("device", {
      __type: "Pointer",
      className: "Device",
      objectId: deviceId,
    });
    const result = historyQuery.ascending("createdAt").find();
    return result;
  } catch (error) {
    console.log("error", error);
  }
};
