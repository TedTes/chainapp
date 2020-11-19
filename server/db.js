require('dotenv').config();
const mongoose=require('mongoose');


mongoose.connect(process.env.DB_URL,{useNewUrlParser:true,useUnifiedTopology:true}).catch(e=>console.log(e));


const userSchema=new mongoose.Schema({
    name:String,
    score:{
        type:Number,
        default:0
    }
})
const statusSchema=new mongoose.Schema({
    usedWords:Array,
    currWord:String
})


const User=mongoose.model('user',userSchema);
const Status=mongoose.model('status',statusSchema);


module.exports={
    User,Status
}