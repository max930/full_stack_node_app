const { check, validationResult } = require('express-validator')
const bcript = require('bcryptjs')

const User = require('../models/user')

const getLogin = (req, res, next) => {
  res.render("auth/login", { 
    pageTitle: "Login Form", 
    isLoggedIn: false, 
    user: {}, 
    errorMessages: undefined, 
    oldInput: undefined 
  })
}


const postLogin = [
  check("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  check("password")
    .notEmpty().withMessage("Password is required"),



  async (req, res, next) => {
    const { email, password } = req.body
    const errors = validationResult(req)


    if (!errors.isEmpty()) {
      return res.render("auth/login", {
        pageTitle: "Login Form",
        isLoggedIn: false,
        errorMessages: errors.array().map(err => err.msg),
        oldInput: { email },
        user: {},
      })
    }

    try {
      const user = await User.findOne({ email })
      if (!user) {
        return res.render("auth/login", {
          pageTitle: "Login Form",
          isLoggedIn: false,
          errorMessages: ["User does not exist"],
          oldInput: { email },
          user: {},
        })
      }

      const isMatch = await bcript.compare(password, user.password)

      if (!isMatch) {
        return res.render("auth/login", {
          pageTitle: "Login Form",
          isLoggedIn: false,
          errorMessages: ["Invalid Password"],
          oldInput: { email },
          user: {},
        })
      }


      req.session.isLoggedIn = true
      req.session.user = user;
      await req.session.save()

      return res.redirect("/homes")

    } catch (error) {
      console.log(error);

      return res.render("auth/login", {
        pageTitle: "Login Form",
        isLoggedIn: false,
        user: {},
        errorMessages: [error],
        oldInput: { email }
      })

    }
  }
]

const postLogout = (req, res, next) => {
  // req.session.isLoggedIn = false
  // res.clearCookie("isLoggedIn")
  // res.cookie("isLoggedIn", false)
  req.session.destroy(() => {
    res.redirect("/login")
  })
}


const getSignup = (req, res, next) => {
  res.render("auth/signup", { 
    pageTitle: "Create Account", 
    isLoggedIn: false, 
    oldData: undefined, 
    errorMessages: undefined,
    user: {},
  })
}

const postSignup = [
  check("firstName")
    .notEmpty().withMessage("First Name is required")
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("First Name must be between 2 and 50 characters"),

  check("lastName")
    .notEmpty().withMessage("Last Name is required")
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("Last Name must be between 2 and 50 characters"),

  check("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  check("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number"),

  check("confirmpassword")
    .notEmpty().withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password do not match")
      }
      return true;
    }),

  check("role")
    .notEmpty().withMessage("User role is required")
    .isIn(["guest", "host"]).withMessage("Invalid user role type"),

  check("terms")
    .notEmpty().withMessage("You must be accept terms and conditions")
    .custom((value) => {
      if (value !== "on") {
        throw new Error("You must be accept terms and conditions")
      }
      return true;
    }),


  (req, res, next) => {
    const { firstName, lastName, email, role, password } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.render("auth/signup", {
        pageTitle: "Create Account",
        isLoggedIn: false,
        errorMessages: errors.array().map(err => err.msg),
        oldData: req.body,
        user: {},
      })
    }


    bcript.hash(password, 12).then(hashedPassword => {
      const newUser = new User({ firstName, lastName, email, role, password: hashedPassword })
      return newUser.save()
    })
      .then(() => {
        res.redirect("/login")
      })
      .catch(err => {
        return res.render("auth/signup", {
          pageTitle: "Create Account",
          isLoggedIn: false,
          errorMessages: [err.message],
          oldData: req.body,
          user: {},
        })
      })
  }
]


module.exports = { getLogin, postLogin, postLogout, getSignup, postSignup }