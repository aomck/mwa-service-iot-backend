import Parse from "../../configs/parse-iot";
import curUserRoleUnit from "../../utils/curUserRoleUnit";
import def from "../../constants/constants";
export default async ({ session, query }) => {
  try {
    let mainUnitQuery = new Parse.Query("Unit");
    if (query.searchText) {
      const nameQuery = new Parse.Query("Unit").contains(
        "name",
        query.searchText
      );
      const shortnameQuery = new Parse.Query("Unit").contains(
        "shortname",
        query.searchText
      );
      mainUnitQuery = Parse.Query.or(nameQuery, shortnameQuery);
    }

    const unitObj = await mainUnitQuery
      .equalTo("isActive", true)
      .equalTo("isDeleted", false)
      .ascending("order")
      .withCount()
      .find();
    const unitParse = JSON.parse(JSON.stringify(unitObj.results));
    const unitResult = await Promise.all(
      unitParse.map(async (unit) => {
        let shortName = await Promise.all(
          unit.parent.map(async (u) => {
            const parentQuey = await new Parse.Query("Unit").get(u);
            return {
              objectId: u,
              order: parentQuey.get("order"),
              name: parentQuey.get("name"),
              shortname: parentQuey.get("shortname"),
            };
          })
        );
        shortName.sort(function (a, b) {
          return b.order - a.order;
        });
        return { ...unit, parent: shortName };
      })
    );
    return { results: unitResult, count: unitObj.count };
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
