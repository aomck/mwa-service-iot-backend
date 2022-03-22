import Parse from "../../configs/parse-iot";

export default async ({ parameterId, user_id }) => {
  try {
    console.log("del param ", parameterId, user_id);
    const parameterObj = Parse.Object.extend("Parameter");
    const parameter = new parameterObj();
    parameter.id = parameterId;
    parameter.set("isDeleted", true);
    parameter.set("updatedBy", user_id);
    return await parameter.save();
  } catch (error) {
    console.log("error", error);
  }
};
