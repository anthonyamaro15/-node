const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURL");

const connectdb = async () => {
  try {
    await mongoose.connect(db, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("mongodb connected");
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
};

module.exports = connectdb;
