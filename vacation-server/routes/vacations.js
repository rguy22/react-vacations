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

//get all vacations
router.get("/", async (req, res, next) => {
  const [results, fields] = await pool.execute(
    `SELECT * FROM VacationsDetails`
  );
  res.send(results);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [results, fields] = await pool.execute(
      `SELECT * FROM VacationsDetails WHERE id = ?`,
      [id]
    );

    if (results.length) {
      res.status(200).send(results[0]);
    }
  } catch (e) {
    res.status(500).send("something has gone wrong! :(");
  }
});

router.put("/", async (req, res) => {
  const { id, destenation, description, picture, dates, price } = req.body;

  if (!id || !destenation || !description || !picture || !dates || !price) {
    res.status(400).send("something missing");
  }

  console.log(id, destenation, description, picture, dates, price);

  try {
    await pool.execute(
      `UPDATE vacationsdetails
        SET description = '${description}', destenation = '${destenation}', picture = '${picture}', dates = '${dates}', price = '${price}'
        WHERE id = ${id}`
    );

    res.status(200).send("success");
  } catch (err) {
    res.status(404).send("faild");
  }
});

router.post("/", async (req, res) => {
  const { description, destenation, picture, dates, price } = req.body;

  if (!id || !destenation || !description || !picture || !dates || !price) {
    res.status(400).send("something missing");
  }

  try {
    await pool.execute(
      `INSERT INTO VacationsDetails (description, destenation, picture, dates, price) VALUES (?,?,?,?,?)`,
      [description, destenation, picture, dates, price]
    );
    res.status(200).send("success");
  } catch {
    res.status(500).send("something went wrong");
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const [results] = await pool.execute(
    `DELETE FROM VacationsDetails WHERE id = ?;`,
    [id]
  );
  if (results.affectedRows) {
    res.status(200).send("ok");
  } else {
    res.status(404).send("faild");
  }
});

module.exports = router;
