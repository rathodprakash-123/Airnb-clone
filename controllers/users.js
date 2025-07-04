const User = require("../models/user.js");


module.exports.getSignupRoute = (req, res) => {
    res.render("user/signup.ejs");
}

module.exports.postSignupRoute = async (req, res) => {
    try{
        let { username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "welcome to wanderlust");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}


module.exports.getLoginRoute = async (req, res) => {
    res.render("user/login.ejs");
}

module.exports.postLoginRoute =  async (req, res) => {
    req.flash("success","welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


module.exports.logoutRoute = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "You are logged out now!");
        res.redirect("/listings");
    });
}