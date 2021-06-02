import Parse from "../../configs/parse-iot";

export default async ({ body, productId }) => {
  try {
    const productObj = Parse.Object.extend("Product");
    const product = new productObj();
    product.id = productId;

    for await (const [key, value] of Object.entries(body)) {
      switch (key) {
        // case "icon":

        //   break;
        default:
          product.set(key, value);
      }
    }
    return await product.save();
  } catch (error) {
    console.log("error", error);
  }
};
