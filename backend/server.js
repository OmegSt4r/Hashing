const express = require("express");
const bodyParser = require("body-parser");
const usersRouter = require("./users");
require("dotenv").config();
const db = require("./db");
const cors = require("cors");
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

const app = express();
const port = process.env.PORT || 5002;
app.use(cors());
app.use(bodyParser.json());
app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
module.exports=app;