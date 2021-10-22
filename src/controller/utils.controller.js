import searchCode from "../services/searchCode";

export const code = async (req, res) => {
  try {
    const { query } = req;
    const respData = await searchCode({ query });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};
