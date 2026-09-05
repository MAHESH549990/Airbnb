const express=require("express");
const router=express.Router();
const Listing=require("../models/listings.js");
const asyncWrap=require("../utils/asyncWrap.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const {isLoggedIn}=require("../middleware.js");


const validateListing=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  next();
}

router.get("/",asyncWrap(async(req,res)=>{
  let Alldata=await Listing.find();
  res.render("listings/listings.ejs",{Alldata});
}));

//create listing
router.get("/new",isLoggedIn,(req,res)=>{
  res.render("listings/newListing.ejs");
});

router.get("/:id",asyncWrap(async(req,res)=>{
  let {id}=req.params;
  let data=await Listing.findById(id).populate("reviews");
  if(!data){
    req.flash("error","The listing you are requested does not exit");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs",{data});
}));

//add new listing
router.post("/",validateListing,asyncWrap(async(req,res,next)=>{
  let newListing= new Listing(req.body.listing);
  await newListing.save();
  req.flash("success","New Listing Added");
  res.redirect("/listings");
}));

//update
router.get("/:id/update",isLoggedIn,asyncWrap(async(req,res)=>{
  let {id}=req.params;
  let data=await Listing.findById(id);
  if(!data){
    req.flash("error","The listing you are requested does not exit");
    return res.redirect("/listings");
  }
  res.render("listings/updateListing.ejs",{data});
}));

//pu in update
router.put("/:id",validateListing,asyncWrap(async(req,res)=>{
    let {id}=req.params;
     if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
     }
    let UpdatedData=await Listing.findByIdAndUpdate(id,
      {...req.body.listing},
      {runValidators:true,new:true}
    );
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",isLoggedIn,asyncWrap(async(req,res)=>{
   let {id}=req.params;
   await Listing.findByIdAndDelete(id);
   req.flash("success","Listing Deleted");
   res.redirect("/listings");
}));

module.exports=router;
