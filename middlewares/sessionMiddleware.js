const session = require('express-session')
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: "sessions"
})

const sessionConfiguration = {
  secret: "here is my strong secret key",
  resave: false,
  saveUninitialized: true,
  store: store
}


module.exports = {sessionConfiguration}


