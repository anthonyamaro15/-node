const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const config = require("config");

const userSchema = new mongoose.Schema({
  //   name: {
  //     type: String,
  //     trim: true
  //   },
  //   age: {
  //     type: Number,
  //     default: 0
  //   },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("please enter email");
      }
    }
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (value.length < 3) {
        throw new Error("password must be longer");
      }
    }
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

userSchema.virtual("info", {
  ref: "Info",
  localField: "_id",
  foreignField: "owner"
});

userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

userSchema.methods.createToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, config.get("secret"));
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.credentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("unable to login");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("unable to login");
  }
  return user;
};

userSchema.pre("save", async function(next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
