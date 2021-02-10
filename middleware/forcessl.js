module.exports = function () {
  return function forceSSL(req, res, next) {
    var FORCE_HTTPS = process.env.FORCE_HTTPS || false;
    if (req.headers["x-forwarded-proto"] !== "https" && FORCE_HTTPS) {
      return res.redirect(["https://", req.get("Host"), req.url].join(""));
    }
    next();
  };
};
