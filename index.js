const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const db = require("./config/db.js");
const cors = require("cors");
const morgan = require("morgan");
const authRoute = require("./routes/authRoute");
//configure env
dotenv.config();

//rest object
const app = express();

//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRoute);
//rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to the test page</h1>");
});

//PORT
const PORT = process.env.PORT || 8080;

//run listen
db.execute("SELECT 1")
  .then(() => {
    app.listen(PORT, () => {
      console.log("DB Connected".bgGreen);
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err.message);
  });
