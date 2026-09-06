const express=require("express");
const router=express.Router({mergeParams:true});
const Review=require("../models/reviews.js");
const Listing=require("../models/listings.js");
const asyncWrap=require("../utils/asyncWrap.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const {validateReview,isLoggedIn,isReviewOwner}=require("../middleware.js");

router.post("/",validateReview,isLoggedIn,asyncWrap(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Added");
    res.redirect(`/listings/${id}`);
}));

router.delete("/:reviewId",isLoggedIn,isReviewOwner,async(req,res)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review Deleted");
  res.redirect(`/listings/${id}`);
});

module.exports=router;
