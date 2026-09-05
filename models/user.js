const mongoose=require("mongoose");
const {Schema}=mongoose;
const passportLocalMongoose = require("passport-local-mongoose").default;

userSchema=new Schema({
  email:{
    type:String,
    required:true
  }
  //passport local mongoose automatically define name and password we don't need to define that separetely 
});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);