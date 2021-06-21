export default (req, res, next) => {
  console.log(`[logger]  : requesting  to ${req.method} ${req.url}`);
  next();
};
