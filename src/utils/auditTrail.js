import Parse from "../configs/parse-iot";

export default async (data) => {
  try {
    const auditTrail = Parse.Object.extend("AuditTrail");
    const auditObj = new auditTrail();
    const userObj = new Parse.Query("Users");

    for await (const [key, value] of Object.entries(data)) {
      // console.log("Key, value:", key, value);
      if (value) {
        switch (key) {
          case "user":
            const curUser = await userObj.get(value);
            // console.log("USER LOG ::: ", curUser);
            auditObj.set(key, curUser);
            auditObj.set("username", curUser.get("username"));
            break;
          default:
            auditObj.set(key, value);
        }
      }
    }

    return await auditObj.save();
  } catch (error) {
    console.log("error ::::", error);
    throw error;
  }
};
