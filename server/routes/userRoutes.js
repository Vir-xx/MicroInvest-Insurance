const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getDashboard } = require("../controllers/userController");

router.get("/dashboard", auth, getDashboard);

module.exports = router;