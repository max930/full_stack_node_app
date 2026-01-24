const { getHomes, getBookings, getFavourites, getIndex, getHomeDetail, postAddToFavourites, postRemoveFavourite } = require('../controllers/storeController')

const storeRouter = require('express').Router()


storeRouter.get("/", getIndex)
storeRouter.get("/homes", getHomes)
storeRouter.get("/bookings", getBookings)
storeRouter.get("/favourites", getFavourites)
storeRouter.post("/favourites", postAddToFavourites)

storeRouter.get("/homes/:homeId", getHomeDetail)

storeRouter.post("/favourites/delete/:homeId", postRemoveFavourite)

module.exports = storeRouter