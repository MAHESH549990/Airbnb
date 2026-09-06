const express=require("express");
const app=express();
const path=require("path");
const port=8080;
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const ExpressError=require("./utils/ExpressError.js");
const listings=require("./routes/listings.js");
const reviews=require("./routes/reviews.js");
const users=require("./routes/users.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

//set
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

//public 
app.use(express.static(path.join(__dirname,"public")));

//urlencoded
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//methodOverride
app.use(methodOverride("_method"));
//ejs-mate
app.engine("ejs",ejsMate);

const sessionOptions={
  secret:"mysupersceretsting",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
}

app.use(session(sessionOptions));
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next()
});



app.listen(port,()=>{
  console.log("Server is running...");
});

app.get("/",(req,res)=>{
  res.send("You're in the root page");
});


//listings
app.use("/listings",listings);

//Reviews
app.use("/listings/:id/reviews",reviews);

//users
app.use("/user",users);


app.use((req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
})

app.use((err,req,res,next)=>{
  let {status=500,message="Some error occured"}=err;
  res.status(status).render("listings/error.ejs",{message});
});

