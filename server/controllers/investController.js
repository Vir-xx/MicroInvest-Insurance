const User = require("../models/User");
const Investment = require("../models/Investment");
const { calculateMultiplier, calculateCoverage } = require("../utils/calculate");

exports.addInvestment = async (req, res) => {
  const { amount } = req.body;

  try {
    const user = await User.findById(req.user);

    if (!user) return res.status(404).json({ msg: "User not found" });

    // Update investment
    user.totalInvestment += amount;

    // Streak logic
    const today = new Date().toDateString();
    const lastDate = user.lastInvestmentDate
      ? new Date(user.lastInvestmentDate).toDateString()
      : null;

    if (lastDate === today) {
      // same day → do nothing
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastDate === yesterday.toDateString()) {
        user.streakCount += 1;
      } else {
        user.streakCount = 1;
      }
    }

    user.lastInvestmentDate = new Date();

    // Update multiplier
    user.multiplier = calculateMultiplier(user.streakCount);

    // Update coverage
    user.insuranceCoverage = calculateCoverage(
      user.totalInvestment,
      user.multiplier
    );

    await user.save();

    // Save investment record
    await Investment.create({
      user_id: user._id,
      amount
    });

    res.json({
      totalInvestment: user.totalInvestment,
      coverage: user.insuranceCoverage,
      multiplier: user.multiplier,
      streak: user.streakCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};