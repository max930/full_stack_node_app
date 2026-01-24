// core module
const path = require('path')


// external modules
const express = require('express')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const multer = require('multer')
require('dotenv').config()

// local module
const rootDir = require('./utils/pathUtil')
const { pageNotFound } = require('./controllers/error')
const storeRouter = require('./route/storeRoutes')
const hostRouter = require('./route/hostRoutes')
const { default: mongoose } = require('mongoose')
const authRouter = require('./route/authRoutes')
const { hostProtect } = require('./controllers/hostController')
const { randomString } = require('./utils/helper')

const app = express()


// ejs setup for view engine
app.set('view engine', 'ejs');
app.set("views", "views")


// middlewares
app.use(express.static(path.join(rootDir, 'public')))
app.use("/uploads", express.static(path.join(rootDir, 'uploads')))
app.use(express.urlencoded())



// multer middleware for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },

  filename: (req, file, cb) => {
    cb(null, randomString(10) + "-" + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const multerOpthins = { storage, fileFilter }

app.use(multer(multerOpthins).single("photo"))
// app.use(multer({dest: "uploads/"}).single("photo"))


// create session or store mongoDB
const db_url = process.env.MONGODB_URL;

const store = new MongoDBStore({
  uri: db_url,
  collection: "sessions"
})


app.use(session({
  secret: "here is my strong secret key",
  resave: false,
  saveUninitialized: true,
  store: store
}))



// routes
app.use(authRouter)
app.use((req, res, next) => {  
  req.isLoggedIn = req.session.isLoggedIn || false;
  req.user = req.session.user || undefined;
  req.isLoggedIn ? next() : res.redirect("/login");
})
app.use("/host", hostProtect, hostRouter)
app.use(storeRouter)

// 404 page
app.use(pageNotFound)


// connect mongoose and run server
const PORT = 3000;
mongoose.connect(db_url).then(() => {
  console.log("MongoDb Connected");
  app.listen(PORT, () => {
    console.log(`server runing on port: ${PORT}`);
  })
}).catch((err) => {
  console.log("Error while connecting to Mongodb", err);
})
