
const verifyUser = (req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn || false;
  req.user = req.session.user || undefined;
  req.isLoggedIn ? next() : res.redirect("/login");
}


const hostProtect = (req, res, next) => {

  if (!req.user) {
    return res.redirect("/login")
  }

  if (req.user.role === "host") {
    next()
  } else {
    return res.redirect("/homes")
  }
}


module.exports = { verifyUser, hostProtect }