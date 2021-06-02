import Parse from "../../configs/parse-iot";

export default async ({ productId }) => {
  try {
    const productQuery = new Parse.Query("Product");
    const result = await productQuery
      .equalTo("objectId", productId)
      .equalTo("isDeleted", false)
      .first();
    return result;
  } catch (error) {
    console.log("error", error);
  }
};
