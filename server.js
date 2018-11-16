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
  const connection = mysql.createConnection({
    host: "birdie-test.cyosireearno.eu-west-2.rds.amazonaws.com",
    user: "test-read",
    password: "xnxPp6QfZbCYkY8",
    database: "birdietest"
  });

  connection.query(
    "SHOW columns FROM census_learn_sql WHERE Type='varchar(50)'",
    (err, rows, fields) => {
      if (err) {
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    }
  );
});

app.put("/api/update", (req, res) => {
  const connection = mysql.createConnection({
    host: "birdie-test.cyosireearno.eu-west-2.rds.amazonaws.com",
    user: "test-read",
    password: "xnxPp6QfZbCYkY8",
    database: "birdietest"
  });
  const userSelection = req.body["selection"];
  const newSelection = `\`${userSelection}\``;
  const selectColumn = `SELECT (${newSelection}) AS category, COUNT(${newSelection}) AS count, AVG(age) AS average FROM census_learn_sql GROUP BY ${newSelection} ORDER BY COUNT(${newSelection}) DESC`;

  connection.query(selectColumn, (err, rows, fields) => {
    if (err) {
      res.sendStatus(500);
      return;
    }

    res.json();
  });
  app.set("newselection", newSelection);
});

app.get("/api/update/list", (req, res) => {
  const connection = mysql.createConnection({
    host: "birdie-test.cyosireearno.eu-west-2.rds.amazonaws.com",
    user: "test-read",
    password: "xnxPp6QfZbCYkY8",
    database: "birdietest"
  });

  const newSelection = app.get("newselection");
  if (newSelection === null) {
    newSelection = "class of worker";
  }
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
