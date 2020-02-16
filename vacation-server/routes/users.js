const mysql = require("mysql2/promise");
var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");

let pool;
(async function initializePool() {
  pool = await mysql.createPool({
    host: "localhost",
    user: "root",
    password: "guyroizman25",
    database: "Vacations",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
})();

//get all users
router.get("/", async (req, res, next) => {
  const [results, fields] = await pool.execute(`SELECT * FROM Users`);
  res.send(results);
});

//get specific user
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [results, fields] = await pool.execute(
      `SELECT * FROM Users WHERE id = ?`,
      [id]
    );

    if (results.length) {
      res.send(results[0]);
    } else {
      res.status(404).send(`user ${id} doesn't exist`);
    }
  } catch (e) {
    res.status(500).send("something has gone wrong! :(");
  }
});

//login
router.post("/login", async (req, res) => {
  let password;
  let { userName, guess } = req.body;
  //

  try {
    const [results, fields] = await pool.execute(
      `SELECT * FROM Users WHERE userName = ?`,
      [userName]
    );

    password = results[0].password;
    console.log(userName, guess);
    bcrypt.compare(guess, password, function(err, reso) {
      if (reso) {
        res.status(200).send(results);
      } else {
        res.status(400).send("faild");
      }
    });
  } catch (e) {
    res.status(400).send("faild");
  }
});

// register
router.post("/register", async (req, res) => {
  var passwordX = "";
  let { firstName, lastName, userName, password } = req.body;

  const [results, fields] = await pool.execute(
    `SELECT EXISTS(SELECT 1 FROM users WHERE userName = '${userName}');`
  );

  const exsists = Object.values(results[0]);

  if (exsists[0] === 1) {
    res.status(400).send("user name already exsists");
  } else {
    bcrypt.hash(password, 10, async function(err, hash) {
      if (err) return next(err);
      passwordX = hash;

      try {
        console.log(firstName, lastName, userName, passwordX);
        const [results, fields] = await pool.execute(
          `INSERT INTO Users (firstName,lastName,userName,password,admin) VALUES (?,?,?,?,?)`,
          [firstName, lastName, userName, passwordX, 0]
        );
        res.status(200).send(results);
      } catch (e) {
        res.status(500).send("something has gone wrong!");
      }
    });
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const [results] = await pool.execute(`DELETE FROM Users WHERE id = ?;`, [id]);
  if (results.affectedRows) {
    res.status(200).send({ success: true });
  } else {
    res.status(404).send({ success: false });
  }
});

module.exports = router;
