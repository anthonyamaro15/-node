const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("config");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, config.get("secret"));
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token
    });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(404).send({ error: "pleases authenticate" });
  }
};

module.exports = auth;
