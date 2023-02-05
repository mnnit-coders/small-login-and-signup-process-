const mongoose=require('mongoose');
// const userschema=require('./user.schema')
mongoose.connect('mongodb://localhost:27017',{
    dbName:'test1',
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>{
    console.log('db is connected')
})
.catch((err)=>console.log(err.message))

const usermodel='1';
module.exports={usermodel};