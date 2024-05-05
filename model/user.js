const mongoose = require("mongoose");
const { Promise } = mongoose;
const saltRound = 10;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});
//hashing password
userSchema.pre("save", function (next) {
  var user = this; //this user schima

  console.log("saving password", user.password);

  //detecting password modified
  if (!user.isModified("password")) return next();
  //genarate salt
  bcrypt.genSalt(saltRound, function (err, salt) {
    if (err) return next(err);
    // hashing password
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// check password

userSchema.methods.comparePassword = function (plainPassword, callback) {
  console.log("compare password", plainPassword, this.password);
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

//generate token
userSchema.methods.generateToken = function (callback) {
  let user = this;
  let token = jwt.sign(user._id.toHexString(), "secret");
  user.token = token;
  user.save().then((user, err) => {
    if (err) return callback(err);
    callback(null, user);
  });
};

//find by token
userSchema.statics.findByToken = function (token, collback) {
  var user = this; // this refers to userSchema here
  jwt.verify(token, "secret", function (err, decoded) {
    user
      .findOne({ _id: decoded, token: token })
      .then((user) => collback(err, user))
      .catch((err) => collback(err, null));
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
