const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");

//get user model
const { User } = require("./model/user");

//get auth middleware
const { auth } = require("./middleware/auth");
/**
 *
 */
//connect mongoDB
mongoose
  .connect(config.mongoURI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//get
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/api/users/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
  });
});

//post
app.post("/api/users/register", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      res.status(200).json({ success: true, data: user });
    })
    .catch((err) => {
      res.status(400).json({ success: false, error: err });
    });
});

app.post("/api/users/login", (req, res) => {
  //find the email
  User.findOne({ email: req.body.email }).then((user, err) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found",
      });
    else {
      //check password
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch)
          return res.json({
            loginSuccess: false,
            message: "Wrong password",
          });
        //generate token
        user.generateToken((err, user) => {
          if (err) return res.status(400).send(err);
          res
            .cookie("x_auth", user.token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id });
          console.log("loginSuccess", user._id);
        });
      });
    }
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" })
    .then((doc) => {
      console.log("logout sucess", doc);
      return res.status(200).json({ success: true, doc });
    })
    .catch((err) => {
      console.log(err);
      return res.json({ success: false, err });
    });
});

app.listen(5000, () => console.log("Server is running on port 5000"));
