const mongoose=require("mongoose");
const {Schema}=mongoose;
const MONGO_URL="mongodb://127.0.0.1:27017/Airbnb";
const defaultImage = "https://plus.unsplash.com/premium_photo-1661962862470-a03bcc2fb415?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const Review=require("./reviews.js");


main()
 .then(()=>{
  console.log("Database connected");
 })
 .catch((err)=>{
  console.log(err);
});

async function main(){
  await mongoose.connect(MONGO_URL);
}

let listingsSchema=new Schema({
  title:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  image: {
        filename: {
            type: String,
        },
        url: {
            type: String,
            default: defaultImage,
            set: (v) => v === "" ? defaultImage : v
        }
    },
  price:{
    type:Number,
  },
  location:{
    type:String,
  },
  country:{
    type:String,
  },
  reviews:[
      {
        type:Schema.Types.ObjectId,
        ref:"Review"
      }
    ]
  }
);

listingsSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
     await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})

module.exports=mongoose.model("Listings",listingsSchema);