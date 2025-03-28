const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config({path:"../.env"});
connectDB();

const app = express();
app.use(cors({origin:"*"}));
app.use(express.json());

app.get("/", (req, res) => res.send("Dr. White Services API Running"));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/providers", require("./routes/serviceProviderRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
