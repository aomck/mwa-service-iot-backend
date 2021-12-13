const { spawn } = require("child_process");
export default async (device_code, data) => {
  let column = [];
  let values = [];
  Object.entries(data).map(([key, value]) => {
    // console.log("==== > ", key, value);
    column.push(key);
    values.push(value);
  });
  
  var query =  `INSERT INTO ll_mwa_iot.pulsation (device_code,${column.join()}) VALUES ('${device_code}',${values.join()})`;
  if(process.env.BIGDATA==="True"){
    console.log(query)
    const python = spawn(process.env.PYTHON_PATH, [
      "script_impyla.py",
      process.env.IMPALA_ADDRESS,
      process.env.IMPALA_PORT,
      query,
      process.env.IMPALA_USERNAME,
      process.env.IMPALA_PASSWORD,
    ]);
    // console.log("======",python)
  }
  
};
