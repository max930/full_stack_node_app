const Home = require("../models/home")
const User = require("../models/user")

const getIndex = (req, res, next) => {
  Home.find().then((homes) => {
    res.render("store/index", {
      pageTitle: "Welcome to airbnb",
      homes,
      isLoggedIn: req.isLoggedIn,
      user: req.user
    })
  })
}


const getHomes = (req, res, next) => {
  Home.find().then((homes) => {
    res.render("store/home-list", {
      pageTitle: "Airbnb homes list",
      homes,
      isLoggedIn: req.isLoggedIn,
      user: req.user
    })
  })
}


const getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "All Booked Homes",
    isLoggedIn: req.isLoggedIn,
    user: req.user
  })
}


const getFavourites = async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id }).populate("favourites");
  res.render("store/favourite-list", {
    pageTitle: "Favourite Homes List",
    homes: user.favourites,
    isLoggedIn: req.isLoggedIn,
    user: req.user
  })
}


const postAddToFavourites = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.user._id

  try {
    const user = await User.findOne({ _id: userId }).populate("favourites")
    const exist = user.favourites.find(favHome => favHome._id === homeId)
    if (exist) {
      console.log("Home exist in favourites");
      return;
    }

    // await User.updateOne({favourites: [...user.favourites, req.body.id]})
    user.favourites.push(homeId)
    await user.save()

  } catch (error) {
    console.log(error);
  } finally {
    res.redirect("/favourites")
  }
}

const postRemoveFavourite = async (req, res, next) => {
  const homeId = req.params.homeId
  const userId = req.user._id

  try {
    const user = await User.findOne({_id: userId})
    if(user.favourites.includes(homeId)){
      user.favourites = user.favourites.filter(favId => favId.toString() !== homeId)
      await user.save()
    }

  } catch (error) {
    if (error) {
      console.log("Someting went wrong on remove favourite home", error);
    }
  } finally {
    res.redirect("/favourites")
  }
}


const getHomeDetail = (req, res, next) => {
  const homeId = req.params.homeId

  Home.findOne({ _id: homeId }).then((home) => {

    if (!home) {
      return res.redirect("/homes")
    }
    res.render("store/home-detail", {
      pageTitle: "Home Detail Page",
      matchHome: home,
      isLoggedIn: req.isLoggedIn,
      user: req.user
    })
  }).catch(err => {
    return res.redirect("/homes")
  })
}

module.exports = { getIndex, getHomes, getBookings, getFavourites, getHomeDetail, postAddToFavourites, postRemoveFavourite }