const pageNotFound = (req, res, next) => {
  res.render("404", { 
    pageTitle: "Page Not Found", 
    isLoggedIn: req.isLoggedIn,
    user: req.user,
   })
}


module.exports = { pageNotFound }