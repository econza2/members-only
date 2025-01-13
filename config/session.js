const database = require("./database");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

const sessionStore = new pgSession({
  pool: database,
});

module.exports = sessionStore;
