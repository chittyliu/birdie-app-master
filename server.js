const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const mysql = require("mysql");

app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));

let globalNewSelection;

const connection = mysql.createConnection({
    host: "birdie-test.cyosireearno.eu-west-2.rds.amazonaws.com",
    user: "test-read",
    password: "xnxPp6QfZbCYkY8",
    database: "birdietest"
});

app.get("/api/rows", (req, res) => {
    connection.query("SHOW columns FROM census_learn_sql WHERE Type='varchar(50)'", (err, rows, fields) => {
        if (err) {
            return res.sendStatus(500);
        }
        return res.json(rows);
    });
});

app.post("/api/update", (req, res) => {
    const userSelection = req.body["selection"];
    globalNewSelection = `\`${userSelection}\``;

    if (globalNewSelection === null || globalNewSelection === undefined || globalNewSelection === "`undefined`") {
        globalNewSelection = "`class of worker`";
    }

    const selectColumn = `SELECT (${globalNewSelection}) AS category, COUNT(${globalNewSelection}) AS count, AVG(age) AS average FROM census_learn_sql GROUP BY ${globalNewSelection} ORDER BY COUNT(${globalNewSelection}) DESC`;
    connection.query(selectColumn, (err, rows, fields) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        return res.json();
    });
});

app.get("/api/update/list", (req, res) => {
    var newSelection = globalNewSelection;

    if (newSelection === null || newSelection === undefined || newSelection === "`undefined`") {
        newSelection = "`class of worker`";
    }
    const selectColumn = `SELECT (${newSelection}) AS category, COUNT(${newSelection}) AS count, AVG(age) AS average FROM census_learn_sql GROUP BY ${newSelection} ORDER BY COUNT(${newSelection}) DESC`;

    connection.query(selectColumn, (err, rows, fields) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        return res.json(rows);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => `Server running on port ${PORT}`);
