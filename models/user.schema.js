const mongoose =require('mongoose');
const bcrypt=require('bcrypt');
const createHttpError = require('http-errors');
const userschema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

userschema.pre('save',async function(){
let salt=await bcrypt.genSalt(10);
const hash=await bcrypt.hash(this.password,salt);
this.password=hash;

})

userschema.methods.isValidPassword=async function(password){
    try {
        return await bcrypt.compare(password,this.password);
    } catch (error) {
        throw createHttpError.InternalServerError(error.message);
    }
}
const user=mongoose.model('user',userschema)
module.exports=user;