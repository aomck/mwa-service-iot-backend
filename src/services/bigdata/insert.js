const { spawn } = require("child_process");
export default async (device_code, data) => {
  let column = [];
  let values = [];
  Object.entries(data).map(([key, value]) => {
    // console.log("==== > ", key, value);
    column.push(key);
    values.push(value);
  });
  console.log(
    `INSERT INTO pulsation (device_code,${column.join()}) VALUES (${device_code},${values.join()})`
  );
  //   const python = spawn("C:/Users/Acer/Anaconda3/envs/isoc/python", [
  //     "script_impyla.py",
  //     "10.147.254.162",
  //     "21050",
  //     "show databases",
  //     "user",
  //     "password",
  //   ]);
};
