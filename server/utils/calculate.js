const calculateMultiplier = (streak) => {
  if (streak >= 30) return 15;
  if (streak >= 7) return 12;
  return 10;
};

const calculateCoverage = (investment, multiplier) => {
  return investment * multiplier;
};

module.exports = { calculateMultiplier, calculateCoverage };