const { Router } = require("express");
const passport = require("passport");
const {
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
  getWrongCode,
  getCorrectCode,
  getBecomeAdmin,
  postBecomeAdmin,
  postDeleteMessage,
} = require("../controllers/indexController");
const { isAuth } = require("./authMiddleware");
const isMem = require("../controllers/checkMembership");

const indexRouter = Router();

indexRouter.get("/", getIndexDirectory);
indexRouter.get("/register", getRegisterUser);
indexRouter.post("/register", postRegistgerUserValidated);
indexRouter.get("/login", getLogIn);
indexRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/login-success",
    failureRedirect: "/login-failure",
  })
);
indexRouter.get("/login-success", isAuth, getLoginSuccess);
indexRouter.get("/login-failure", getLoginFailure);
indexRouter.get("/create-message", isAuth, isMem, getCreateMessage);
indexRouter.post("/create-message", postCreateMessage);
indexRouter.get("/become-member", getBecomeMember);
indexRouter.post("/become-member", postBecomeMember);
indexRouter.get("/wrong-code", getWrongCode);
indexRouter.get("/correct-code", getCorrectCode);
indexRouter.get("/become-admin", getBecomeAdmin);
indexRouter.post("/become-admin", postBecomeAdmin);
indexRouter.post("/:message_id/delete", postDeleteMessage);
indexRouter.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = indexRouter;
