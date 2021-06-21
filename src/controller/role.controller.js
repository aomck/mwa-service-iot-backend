import { roleService } from "../services";

export const option = async (req, res) => {
  try {
    const { headers } = req;
    const session = headers["session_token"];
    const respData = await roleService.option({ session });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};
