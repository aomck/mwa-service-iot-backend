const { spawn } = require("child_process");
const moment = require("moment");

export default async (device_code, datetime, data) => {
  let dataQuery = [];
  // console.log("xxxxxx",data)
  Object.entries(data).map(([key, value]) => {
    // console.log("==== > ", key, value);
    dataQuery.push(
      `('${device_code}','${moment(datetime).format(
        "YYYY-MM-DD HH:mm:ss"
      )}','${key}','${value}')`
    );
  });
  // console.log(dataQuery);
  var query = `INSERT INTO ll_mwa_iot.iot_platform (device_code,created_at,key,value) VALUES (${dataQuery.join()})`;
  if (process.env.BIGDATA === "True") {
    console.log(query);
    const python = spawn(process.env.PYTHON_PATH, [
      "script_impyla.py",
      process.env.IMPALA_ADDRESS,
      process.env.IMPALA_PORT,
      query,
      process.env.IMPALA_USERNAME,
      process.env.IMPALA_PASSWORD,
    ]);
    console.log("======",python)
  }
};
