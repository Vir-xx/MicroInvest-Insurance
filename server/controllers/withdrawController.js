const User = require("../models/User");
const Withdrawal = require("../models/Withdrawal");
const { calculateCoverage } = require("../utils/calculate");

exports.withdrawAmount = async (req, res) => {
  const { amount } = req.body;

  try {
    const user = await User.findById(req.user);

    if (!user) return res.status(404).json({ msg: "User not found" });

    if (amount <= 0) {
      return res.status(400).json({ msg: "Invalid amount" });
    }

    if (amount > user.totalInvestment) {
      return res.status(400).json({ msg: "Insufficient balance" });
    }

    // Before values (for warning)
    const beforeInvestment = user.totalInvestment;
    const beforeCoverage = user.insuranceCoverage;

    // Update investment
    user.totalInvestment -= amount;

    // Recalculate coverage
    user.insuranceCoverage = calculateCoverage(
      user.totalInvestment,
      user.multiplier
    );

    await user.save();

    // Save withdrawal record
    await Withdrawal.create({
      user_id: user._id,
      amount
    });

    res.json({
      message: "Withdrawal successful",
      before: {
        investment: beforeInvestment,
        coverage: beforeCoverage
      },
      after: {
        investment: user.totalInvestment,
        coverage: user.insuranceCoverage
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};