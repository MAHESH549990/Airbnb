const joi=require("joi");
const listings = require("./models/listings");

module.exports.listingSchema=joi.object({
    listing:joi.object({
      title:joi.string().required(),
      description:joi.string().required(),
      price:joi.number().required().min(0),
      location:joi.string().required(),
      country:joi.string().required(),
      image:joi.object({
        url:joi.string().allow("",null)
      }).allow(null)
    }).required()
});


module.exports.reviewSchema=joi.object({
  review:joi.object({
    comment:joi.string().required(),
    rating:joi.number().required().min(1).max(5),
    image:joi.object({
      url:joi.string().allow("",null)
    }).allow(null)
  }).required()
});