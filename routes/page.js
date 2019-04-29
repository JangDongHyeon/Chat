const express=require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router =express.Router();

router.get('/',(req,res)=>{
    res.render('index.ejs',{
     user:req.user,
    headerCheck:true,
});
});



router.get('/join',isNotLoggedIn,(req,res)=>{
    res.render('join',{
        
        user:req.user,
        joinError:req.flash('joinEroor'),
        headerCheck:false,
    });
});


router.get('/login',(req,res)=>{
    res.render('login',{
        user:req.user,
        loginError:req.flash('loginError'),
        headerCheck:false,
    });
});

module.exports=router;