const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { addInvestment } = require("../controllers/investController");

router.post("/", auth, addInvestment);

module.exports = router;