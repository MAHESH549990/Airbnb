const express=require("express");
const router=express.Router();
const asyncWrap=require("../utils/asyncWrap.js");

const User=require("../models/user.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup",(req,res)=>{
  res.render("userLogin/signup.ejs");
});

router.post("/signup",asyncWrap(async(req,res)=>{
  try{
      let {username,password,email}=req.body;
      let newUser={username,email};
      let newUserDetails=await User.register(newUser,password);
      req.login(newUserDetails,(err)=>{
        if(err){
          return next(err);
        }
      req.flash("success","Welcome to Airbnb");
      res.redirect("/listings");
      })
  }
  catch(err){
      req.flash("error",err.message);
      res.redirect("/user/signup");
  }
}));

router.get("/login",(req,res)=>{
  res.render("userLogin/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/user/login",
    failureFlash: "Invalid username or password"
  }),
  (req, res) => {
    req.flash("success", "Welcome back to Airbnb");
    let redirectUrlNew=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrlNew);
  }
);

router.get("/logout",(req,res,next)=>{
   req.logout((err)=>{
    if(err){
          res.send(err);
          return next();
    }
     req.flash("success","You're logged out");
     res.redirect("/listings");
   })
})


module.exports=router;