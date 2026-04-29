const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));

app.get("/", (req, res) => {
  res.send("InsureVest API Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

app.use("/api/invest", require("./routes/investRoutes"));
app.use("/api/withdraw", require("./routes/withdrawRoutes"));
app.use("/api/user", require("./routes/userRoutes"));