const express = require("express");
const User = require("../models/user");
const auth = require("../auth/auth");

const router = express.Router();

// create user
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.createToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(404).send(e);
  }
});

// login user..
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.credentials(req.body.email, req.body.password);
    const token = await user.createToken();
    res.send({ user, token });
  } catch (e) {
    res.status(404).send(e);
  }
});

// read profile
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

// edit user
router.put("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allow = ["name", "age", "password", "email"];
  const isValid = updates.every(update => allow.includes(update));
  if (!isValid) {
    throw new Error("invalid update!");
  }

  try {
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

// logout
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      token => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

// logout all users
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// delete user
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
