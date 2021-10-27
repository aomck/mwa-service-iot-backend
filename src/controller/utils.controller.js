import searchCode from "../services/searchCode";
import searchKey from "../services/searchKey";

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

export const key = async (req, res) => {
  try {
    const { query } = req;
    const respData = await searchKey({ query });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};
