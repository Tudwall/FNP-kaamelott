/**
 *
 */
require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const path = require("path");
const app = express();

/**
 * Setup View Engine
 */
app.set("views", path.join(__dirname, "views")); // specify the views directory
app.set("view engine", "ejs"); // register the template engine

/**
 * Setup static files serving
 */
app.use("/public", express.static(path.join(__dirname, "public"))); // serve static files from "public" directory

app.get("/", (req, res) => {
  res.render("pages/index"); // render the "index" view
});
app.get("/kingdom", (req, res) => {
  res.render("pages/kingdom");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
