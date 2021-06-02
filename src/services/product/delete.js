import Parse from "../../configs/parse-iot";

export default async ({ productId }) => {
  try {
    const productObj = Parse.Object.extend("Product");
    const product = new productObj();
    product.id = productId;

    product.set("isDeleted", true);
    return await product.save();
  } catch (error) {
    console.log("error", error);
  }
};
