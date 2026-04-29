const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  totalInvestment: { type: Number, default: 0 },
  insuranceCoverage: { type: Number, default: 0 },
  multiplier: { type: Number, default: 10 },
  streakCount: { type: Number, default: 0 },
  lastInvestmentDate: Date
});

module.exports = mongoose.model("User", userSchema);