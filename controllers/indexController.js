const { body, validationResult } = require("express-validator");
const database = require("../config/database");
const bcrypt = require("bcryptjs");

const validateUser = [
  body("first_name")
    .notEmpty()
    .withMessage("First Name cannot be empty")
    .isAlpha()
    .withMessage("First Name must only contain letters"),
  body("last_name")
    .notEmpty()
    .withMessage("Last Name cannot be empty")
    .isAlpha()
    .withMessage("Last Name must only contain letters"),
  body("username").notEmpty().withMessage("Username cannot be empty"),
  body("password")
    .isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Your Password MUST contain at least one Uppercase, one Number and One Symbol amd be at least 8 characters long"
    ),
  body("confirm_password")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords MUST match"),
  body("username").custom(async (value) => {
    const user = await database.query(
      "SELECT * FROM users WHERE username = $1",
      [value]
    );

    if (user) {
      throw new Error("Username already exists, try another username");
    }
  }),
];

function getIndexDirectory(req, res) {
  console.log();
  res.render("index");
}

function getRegisterUser(req, res) {
  res.render("registerUser");
}

const postRegistgerUserValidated = [
  validateUser,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("registerUser", {
        errors: errors.array(),
      });
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          console.log("Error entering information into database");
        } else {
          try {
            await database.query(
              "INSERT INTO users (firstname, lastname, username, password, membership_status) VALUES ($1, $2, $3, $4, $5)",
              [
                req.body.first_name,
                req.body.last_name,
                req.body.username,
                hashedPassword,
                false,
              ]
            );
          } catch (err) {
            return next(err);
          }
        }
      });
    }
    res.redirect("/");
  },
];

function getLogIn(req, res) {
  res.render("login");
}

function getLoginSuccess(req, res) {
  res.render("loginSuccess", {
    isMember: req.user.membership_status,
    isAdmin: req.user.isadmin,
  });
}

function getLoginFailure(req, res) {
  res.render("loginFailure");
}

function getCreateMessage(req, res) {
  res.render("createMessage");
}

async function postCreateMessage(req, res) {
  let currentTime = new Date();

  await database.query(
    "INSERT INTO messages (title, timestamp, message_text, user_id) VALUES ($1, $2, $3, $4)",
    [req.body.title, currentTime, req.body.message, req.user.user_id]
  );

  res.redirect("/login-success");
}

function getBecomeMember(req, res) {
  res.render("becomeMember");
}

async function postBecomeMember(req, res) {
  if (req.body.code === process.env.MEMBERSHIP_CODE) {
    const { rows } = await database.query(
      "SELECT * FROM users WHERE user_id = $1",
      [req.user.user_id]
    );

    const user = rows[0];

    if (user.membership_status) {
      await database.query(
        "UPDATE users SET membership_status = 'false' WHERE user_id = $1",
        [req.user.user_id]
      );
    } else {
      await database.query(
        "UPDATE users SET membership_status = 'true' WHERE user_id = $1",
        [req.user.user_id]
      );
    }

    res.redirect("/correct-code");
  } else {
    res.redirect("/wrong-code");
  }
}

function getCorrectCode(req, res) {
  res.render("correctCode");
}

function getWrongCode(req, res) {
  res.render("wrongCode");
}

function getBecomeAdmin(req, res) {
  res.render("becomeAdmin");
}

async function postBecomeAdmin(req, res) {
  if (req.body.code === process.env.ADMIN_CODE) {
    const { rows } = await database.query(
      "SELECT * FROM users WHERE user_id = $1",
      [req.user.user_id]
    );

    const user = rows[0];

    if (user.isadmin) {
      await database.query(
        "UPDATE users SET isadmin = 'false' WHERE user_id = $1",
        [req.user.user_id]
      );
    } else {
      await database.query(
        "UPDATE users SET isadmin = 'true' WHERE user_id = $1",
        [req.user.user_id]
      );
    }

    res.redirect("/correct-code");
  } else {
    res.redirect("/wrong-code");
  }
}

async function postDeleteMessage(req, res) {
  await database.query("DELETE FROM messages WHERE message_id = $1", [
    req.params.message_id,
  ]);

  res.redirect("/login-success");
}

module.exports = {
  getIndexDirectory,
  getRegisterUser,
  postRegistgerUserValidated,
  getLoginSuccess,
  getLoginFailure,
  getLogIn,
  getCreateMessage,
  postCreateMessage,
  getBecomeMember,
  postBecomeMember,
  getCorrectCode,
  getWrongCode,
  getBecomeAdmin,
  postBecomeAdmin,
  postDeleteMessage,
};
