const express = require("express");
const bodyParser = require("body-parser");
const usersRouter = require("./users");
require("dotenv").config();
const db = require("./db");

const app = express();
const port = process.env.PORT || 5002;

app.use(bodyParser.json());
app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});