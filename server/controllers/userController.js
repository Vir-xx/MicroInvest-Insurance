const User = require("../models/User");
const Investment = require("../models/Investment");
const Withdrawal = require("../models/Withdrawal");

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Last 10 investments
    const investments = await Investment.find({ user_id: user._id })
      .sort({ date: -1 })
      .limit(10);

    // Last 10 withdrawals
    const withdrawals = await Withdrawal.find({ user_id: user._id })
      .sort({ date: -1 })
      .limit(10);

    // Graph data (simple cumulative)
    const allInvestments = await Investment.find({ user_id: user._id })
      .sort({ date: 1 });

    let cumulative = 0;
    const graphData = allInvestments.map((inv) => {
      cumulative += inv.amount;
      return {
        date: inv.date,
        total: cumulative
      };
    });

    res.json({
      user: {
        name: user.name,
        totalInvestment: user.totalInvestment,
        insuranceCoverage: user.insuranceCoverage,
        multiplier: user.multiplier,
        streakCount: user.streakCount
      },
      investments,
      withdrawals,
      graphData
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};