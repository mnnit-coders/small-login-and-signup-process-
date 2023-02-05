const router=require('express').Router();
const user = require('../models/user.schema');
const userschema=require('../models/user.schema')
const emailvalidator=require('email-validator')
const {body,validationResult}=require('express-validator')
const passport=require('passport');



router.get('/register',ensurenotauthenticated,async (req,res)=>{
    try {
        res.render('register');
    } catch (error) {
        res.render('error',{error:error.message})
    }
   
})


router.post('/register',ensurenotauthenticated,[
    body('email').trim().isEmail().withMessage('Email must be a valid email').normalizeEmail().toLowerCase(),
    body('password').trim().isLength(2).withMessage('Password should be of 2 or more characters'),
    body('password2').custom((value,{req})=>{
     if(value!=req.body.password){
        throw new Error('password is not match')
     }
     return true;
    })
],async(req,res)=>{
    try {

        var errors=validationResult(req);
        if(!errors.isEmpty()){
            errors=errors.array()[0];
            res.render('register',{
            info:errors.msg
            })
            return;
        }


        const new_user_email=req.body.email;
            const doesexist=await user.findOne({email:req.body.email});
            if(doesexist){
                res.render('register',{
                    info:'User already exist'
                })
                return;
            }
            const newuser=await user.create(req.body)
             res.redirect('/auth/login')
    } catch (error) {
        res.render('error',{error:error.message})
    }
   
})

router.get('/login',ensurenotauthenticated,async(req,res,next)=>{
    res.render('login');
})
router.post('/login',ensurenotauthenticated,passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/auth/login',
}
))


router.get('/logout',ensureauthentication,async (req,res,next)=>{
     req.logout((err)=>{
        if(err) console.log(err)
     });
     res.redirect('/');

})



function emailchecker(email){
    return emailvalidator.validate(email);
}
function ensureauthentication(req,res,next){
    if(req.isAuthenticated()){
        next();
    }
    else[
        res.redirect('/auth/login')
    ]
}
function ensurenotauthenticated(req,res,next){
    if(req.isAuthenticated()){
       res.redirect('back');
    }
    else[
        next()
    ]
}
module.exports=router;