if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
};

const express = require("express")
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const port = process.env.PORT || 8080 

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { error } = require('console');

const db_Url = process.env.ATLASDB_URL;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
main().then(()=>{
    console.log("databse working");
}).catch((err)=>{
    console.log(err);
});

 const store = MongoStore.create({
    mongoUrl:db_Url,
    crypto: {
    secret: process.env.SECRET
  },
  touchAfter:48*3600
 });
 store.on("error",()=>{
    console.log("Error in store",err);
 });

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly: true,
    },
};
async function main() {
    try {
        await mongoose.connect(db_Url);
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
    }
}

main(); 
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });

//    let u1 = await User.register(fakeUser,"helloworld");
//    res.send(u1);

// });

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page not Found !"));
// })

// app.use((err,req,res,next)=>{
//     let{statuscode = 505,message="Something went wrong"} = err;
//     res.status(statuscode).render("error.ejs");
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
