import { loraService } from "../services";

export const getById = async (req, res) => {
  try {
    const {
      params: { lora_id },
      headers: { lora_token },
    } = req;
    const respData = await loraService.getFromGateway({ lora_id, lora_token });
    res.json(respData);
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: "500", message: "Internal Server Error" });
  }
};
