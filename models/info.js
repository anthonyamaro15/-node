const mongoose = require("mongoose");

const infoSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  single: {
    type: Boolean,
    default: true
  },
  language: {
    type: String,
    trim: true
  }
});

const Info = mongoose.model("Info", infoSchema);

module.exports = Info;
