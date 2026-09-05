module.exports.isLoggedIn=(req,res,next)=>{
  if(!req.isAuthenticated()){
    req.flash("error","You must be logged in for create listing");
    return res.redirect("/user/login");
  }
  next();
}