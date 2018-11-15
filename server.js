const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const mysql = require("mysql");

app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));

app.get("/api/rows", (req, res) => {
  console.log("Fetching dropdowns...");

  const connection = mysql.createConnection({
    host: "birdie-test.cyosireearno.eu-west-2.rds.amazonaws.com",
    user: "test-read",
    password: "xnxPp6QfZbCYkY8",
    database: "birdietest"
  });

  const selectAllRows =
    "SHOW columns FROM census_learn_sql WHERE Type='varchar(50)'";

  connection.query(selectAllRows, (err, rows, fields) => {
    if (err) {
      res.sendStatus(500);
      return;
    }

    res.json(rows);
  });
});

app.post("/api/update", (req, res) => {
  const userSelection = req.body["name"];
  console.log("Getting userselection...", userSelection);

  // mysql fetching data
  console.log("Updating lists...");

  const connection = mysql.createConnection({
    host: "birdie-test.cyosireearno.eu-west-2.rds.amazonaws.com",
    user: "test-read",
    password: "xnxPp6QfZbCYkY8",
    database: "birdietest"
  });
  const newSelection = `\`${userSelection}\``;
  const selectColumn = `SELECT (${newSelection}) AS category, COUNT(${newSelection}) AS count, AVG(age) AS average FROM census_learn_sql GROUP BY ${newSelection} ORDER BY COUNT(${newSelection}) DESC`;

  connection.query(selectColumn, (err, rows, fields) => {
    if (err) {
      res.sendStatus(500);
      return;
    }

    res.json(rows);
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => `Server running on port ${PORT}`);
