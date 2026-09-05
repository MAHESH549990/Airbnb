const express=require("express");
const app=express();
const path=require("path");
const port=8080;
const cookieParser=require("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

const sessionOptions={
   secret:"mysupersecretcode",
   resave:false,
   saveUninitialized:false,
   cookie:{
    httpOnly:true
   }
}

app.use(session(sessionOptions));

app.use(flash());
// Make flash message available to EJS
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  next();
})



app.listen(port,()=>{
  console.log("Server is running...");
});


app.get("/login",(req,res)=>{
  req.session.username="Mahesh Bhatt";
  req.flash("success","User login successfully");
  res.redirect("/profile");
});

app.get("/profile",(req,res)=>{
  let username=req.session.username;
  res.render("profile.ejs",{username});
});



