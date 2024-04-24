const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongoDBpassowrd = "KkQpmE91uWfy4OjT";

//connect mongoDB
mongoose
  .connect(
    `mongodb+srv://leejongmin774:${mongoDBpassowrd}@mern.zlp217k.mongodb.net/?retryWrites=true&w=majority&appName=MERN`,
    {
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(5000, () => console.log("Server is running on port 5000"));
