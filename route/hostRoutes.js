const hostRouter = require('express').Router()

const upload = require('../middlewares/multerMiddleware')

// controllers import
const { getAddHome, postAddHome, getHostHomes, getEditHome, postEditHome, postDeleteHome } = require('../controllers/hostController')


hostRouter.get("/add-home", getAddHome)
hostRouter.post("/add-home", upload.single("photo"), postAddHome)

hostRouter.get("/edit-home", postAddHome)
hostRouter.get("/host-home-list", getHostHomes)

hostRouter.get("/edit-home/:homeId", getEditHome)
hostRouter.post("/edit-home", upload.single("photo"), postEditHome)

hostRouter.post("/delete-home/:homeId", postDeleteHome)

module.exports = hostRouter