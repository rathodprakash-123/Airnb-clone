const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage})


router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createNewListings)); //index route + add new listing route


router.get("/new", isLoggedIn, listingController.newRoute);//create route

router
    .route("/:id")
    .get(wrapAsync(listingController.showRoute)) //show route
    .put(isLoggedIn, isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateRoute))//update route
    .delete(isLoggedIn, isOwner, listingController.deleteRoute);//delete route

router.get("/:id/edit", isLoggedIn, isOwner, listingController.editRoute);//edit route


module.exports = router;