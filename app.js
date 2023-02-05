const express=require('express');
const httperror=require('http-errors')
const mongoose=require('mongoose');
require('dotenv').config(__dirname)
const path=require('path')
const app=express();
const model=require('./models/user.model')
const hbs=require('hbs');
const cookieparser=require('cookie-parser')
// const flash=require('req-flash')
app.use(express.json());
const session=require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const connectflash=require('connect-flash')
const passport =require('passport');
var store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/test1',
    collection: 'mySessions'
  });
app.use(session({
    secret:process.env.Session_secret,
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true
    },
    store:store
}))
app.use(connectflash());

app.use(passport.initialize());
app.use(passport.session());

require('./utils/passport.auth');
app.use((req,res,next)=>{
    res.locals.user=req.user;
    next();
})
app.use((req,res,next)=>{
    res.locals.messages=req.flash();
    next();
})

app.use(express.static(path.join(__dirname,'./views')))
app.set('view engine','hbs');
app.set('views',path.join(__dirname,'./views'))
hbs.registerPartials(path.join(__dirname,'./views/partials'))


app.use(express.urlencoded({extended:false}))
app.use(express.static('public'))
app.use('/',require('./routes/index.js'))
app.use('/auth',require('./routes/auth'))
app.use('/user',ensureauthentication,require('./routes/user'))


app.use((req,res,next)=>{
    next(httperror.NotFound());
})
app.use((error,req,res,next)=>{
    let code=error.status||500;
    res.status(404)
    res.render('error');
})


function ensureauthentication(req,res,next){
    if(req.isAuthenticated()){
        next();
    }
    else[
        res.redirect('/auth/login')
    ]
}
app.listen(3000,()=>{
    console.log('app is listening on port 3000')
})