function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.send(
      '<h1>You are not authorized to view this resource</h1><a href="/login">Log In</a>'
    );
  }
}

module.exports = { isAuth };
