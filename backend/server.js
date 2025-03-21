const express = require("express");
const bodyParser = require("body-parser");
const usersRouter = require("./users");
require("dotenv").config();
const db = require("./db");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5002;

app.use(cors());

app.use(bodyParser.json());
app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
