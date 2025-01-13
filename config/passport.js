const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const database = require("./database");
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await database.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (user_id, done) => {
  try {
    const { rows } = await database.query(
      "SELECT * FROM users WHERE user_id = $1",
      [user_id]
    );
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});
