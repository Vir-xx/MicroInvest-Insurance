const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Withdrawal", withdrawalSchema);