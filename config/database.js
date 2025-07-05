require('dotenv').config();
const mongoose = require('mongoose');

module.exports.connect = async () => {
  try {
    console.log("🔧 Connecting to:", process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connect Success!");
  } catch (err) {
    console.log("❌ Connect Fail!");
    console.error(err);
  }
};
