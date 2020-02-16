const mysql = require("mysql2/promise");
var express = require("express");
var router = express.Router();
// const bcrypt = require("bcrypt");

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
  const [results, fields] = await pool.execute(
    `SELECT Users.id, Users.userName, Users.password FROM Users;`
  );
  res.send(results);

  passport.use(
    new LocalStrategy(
      {
        // this defines that the POST request will contain the fields "name" and "password"
        usernameField: "name",
        passwordField: "password"
      },
      // this is the function that runs for each authentication request and decides if the authentication is successful or not
      function(name, password, done) {
        // this is a fake query and should be replaced with a real SQL query to match the user and password in the db
        const user = users.find(
          user => user.name === name && user.password === password
        );

        if (!user) {
          // if name and password don't match or user doesn't even exist, we return an error using `done(error: string)` call
          return done("invalid credentials!");
        }
        /* successful authentication, continue request. 
        `null` indicates there's no error, and the second argument is the actual user object that matches the auth request
        */
        return done(null, user);
      }
    )
  );

  /* when the user authenticates, we send the browser some data to store in the cookies so the user would be automatically identified in future visits.
   we don't want to store a lot of data in the cookie - just something that identifies that user uniquely.
   passport.serializeUser is a function that lets choose what to return to the browser for storing in the cookie
   so instead of storing the whole user object, we only store the id
*/
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  /* this is the reverse function of serializeUser - if the user has already auth data in the browser cookies, the browser will send that data to the server
   passport middleware will take the data in the cookie (e.g. the user's id) and use that data to find the matching user in the db
*/
  passport.deserializeUser(function(id, done) {
    const user = users.find(user => user.id === id);
    if (!user) {
      return done(`user doesn't exist!`);
    }
    return done(null, user);
  });
});
module.exports = router;
