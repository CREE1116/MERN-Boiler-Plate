const { User } = require("../model/user");

let auth = (req, res, next) => {
  let token = req.cookies.x_auth;
  User.findByToken(token, (err, user) => {
    if (err) {
      console.log("cant found token");
      return res.json({
        isAuth: false,
        error: true,
        err: err,
      });
    }
    if (!user) {
      console.log("cant found user");
      return res.json({
        isAuth: false,
        error: true,
        err: "user not found",
      });
    }
    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
