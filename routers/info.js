const express = require("express");
const Info = require("../models/info");
const auth = require("../auth/auth");

const router = express.Router();

// create
router.post("/create", auth, async (req, res) => {
  const info = new Info({
    ...req.body,
    owner: req.user._id
  });

  try {
    await info.save();
    res.status(201).send(info);
  } catch (e) {
    res.status(500).send();
  }
});

// read info
router.get("/create", auth, async (req, res) => {
  try {
    await req.user.populate("info").execPopulate();
    res.send(req.user.info);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
