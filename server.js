require("@babel/register")({
  presets: ["@babel/preset-env"],
});
require("babel-polyfill");
module.exports = require("./src/index");
