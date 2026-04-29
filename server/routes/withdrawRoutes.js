const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { withdrawAmount } = require("../controllers/withdrawController");

router.post("/", auth, withdrawAmount);

module.exports = router;