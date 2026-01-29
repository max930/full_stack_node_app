// core module
const path = require('path')


// external modules
const express = require('express')
const session = require('express-session')
require('dotenv').config()

// local module
const rootDir = require('./utils/pathUtil')
const { pageNotFound } = require('./controllers/error')
const { default: mongoose } = require('mongoose')
const { hostProtect, verifyUser } = require('./middlewares/authMiddleware')
const { sessionConfiguration } = require('./middlewares/sessionMiddleware')


const app = express()


// ejs setup for view engine
app.set('view engine', 'ejs');
app.set("views", "views")


// middlewares
app.use(express.static(path.join(rootDir, 'public')))
app.use("/uploads", express.static(path.join(rootDir, 'uploads')))
app.use(express.urlencoded())

// create user session
app.use(session(sessionConfiguration))



// routes import
const hostRouter = require('./route/hostRoutes')
const storeRouter = require('./route/storeRoutes')
const authRouter = require('./route/authRoutes')


// routes declaration
app.use(authRouter)
app.use("/host", verifyUser, hostProtect, hostRouter)
app.use(verifyUser, storeRouter)

// 404 route
app.use(pageNotFound)


// connect mongoose and run server
const PORT = 3000;
mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("MongoDb Connected");
  app.listen(PORT, () => {
    console.log(`server runing on port: ${PORT}`);
  })
}).catch((err) => {
  console.log("Error while connecting to Mongodb", err);
})
