const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN_KEY
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
};

module.exports.newRoute = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showRoute = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author", } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    };
    res.render("listings/show.ejs", { listing });
};

module.exports.createNewListings = async (req, res) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();
    console.log("Mapbox Geocoding Response:", response.body);

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.geometry = response.body.features[0].geometry;
   let t1= await newListing.save();
   console.log(t1);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.editRoute = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    };
    //  let originalImageUrl = listing.image.url;
    // originalImageUrl = originalImageUrl.replace("/upload","/upload/w_350");

    res.render("listings/edit.ejs", { listing });
};

module.exports.updateRoute = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // If location is changed, geocode again
    if (req.body.listing.location) {
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        }).send();

        listing.geometry = response.body.features[0].geometry;
    }

    // If a new image was uploaded
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    await listing.save();

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteRoute = async (req, res) => {
    let { id } = req.params;
    let deleteListings = await Listing.findByIdAndDelete(id);
    console.log(deleteListings);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};