const User = require("../models/user");

module.exports.gerSignupRoute = (req, res) => {
    res.render("user/signup.ejs");
};

module.exports.postSignupRoute = async (req, res,next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const reUser = await User.register(newUser, password);
        req.login(reUser,(err)=>{
            if(err){
                return next(err)
            }
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listings");
        });
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.getLoginRoute = (req, res) => {
    res.render("user/login.ejs");
};

module.exports.postLoginRoute = async (req, res) => {
        req.flash("success","Welcome to wanderlust");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
};

module.exports.logoutRoute = (req,res,next)=>{
    req.logOut((err) =>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
};