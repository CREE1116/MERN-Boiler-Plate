const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");

//get user model
const { User } = require("./model/user");

//connect mongoDB
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
  })
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

//routes
//get
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//post
app.post("/api/users/register", (req, res) => {
  const user = new User(req.body);
  user.save((err, userData) => {
    if (err) return res.json({ success: false, err });
  });
  return res.status(200).json({ success: true });
});

app.listen(5000, () => console.log("Server is running on port 5000"));
