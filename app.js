const path = require("node:path");
const express = require("express");
const indexRouter = require("./routes/indexRouter");
require("dotenv").config();
const passport = require("passport");
const session = require("express-session");
const sessionStore = require("./config/session");
require("./config/passport");
const usersMiddleware = require("./routes/usersMiddleware");
const messagesMiddleware = require("./routes/messagesMiddleware");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(usersMiddleware);
app.use(messagesMiddleware);
app.use(indexRouter);

app.listen(3000, () => console.log("app listening on port 3000!"));
