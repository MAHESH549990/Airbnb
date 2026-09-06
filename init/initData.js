const mongoose=require("mongoose");
const initedata=require("./data.js");
const Listing=require("../models/listings.js");

const MONGO_URL="mongodb://127.0.0.1:27017/Airbnb";

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

const initData=async()=>{
  await Listing.deleteMany({});
  initedata.data=initedata.data.map((obj)=>(
    {...obj,
    owner:"6a9b9ab92a821d548a3351af"
    }));
  await Listing.insertMany(initedata.data);
  console.log("Data was initalized");
}

initData();