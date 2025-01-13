function isMem(req, res, next) {
  if (req.user.membership_status) {
    next();
  } else {
    res.redirect("/become-member");
  }
}

module.exports = isMem;
