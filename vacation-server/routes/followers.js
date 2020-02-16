const mysql = require("mysql2/promise");
var express = require("express");
var router = express.Router();

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

router.get("/", async (req, res, next) => {
  const [results, fields] = await pool.execute(`select V.id as vacationID
  from followers F join users U on F.userID = U.id join vacationsdetails V on F.vacationID = V.id;`);
  res.send(results);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [results, fields] = await pool.execute(
      `SELECT * FROM Followers WHERE id = ?`,
      [id]
    );

    if (results.length) {
      res.send(results[0]);
    } else {
      res.status(404).send(`vacation ${id} doesn't exist`);
    }
  } catch (e) {
    res.status(500).send("something has gone wrong! :(");
  }
});

router.post("/", async (req, res) => {
  const { vacationID, userID } = req.body;
  console.log(vacationID, userID);
  try {
    await pool.execute(
      `INSERT INTO followers (vacationID,userID) VALUES (${vacationID},${userID})`
    );
    res.status(200).send("ok");
  } catch (e) {
    console.log(e);
    res.status(500).send("faild");
  }
});

router.delete("/", async (req, res) => {
  const { vacationID, userID } = req.body;
  console.log(vacationID, userID);

  const [results] = await pool.execute(
    `DELETE FROM followers WHERE vacationID = ? AND userID = ?;`,
    [vacationID, userID]
  );
  if (results.affectedRows) {
    res.status(200).send({ success: true });
  } else {
    res.status(404).send({ success: false });
  }
});

module.exports = router;
