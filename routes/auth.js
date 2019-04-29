const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

router.post('/join',isNotLoggedIn,async(req,res,next)=>{
    const {email,nick,password}=req.body;
    try{
        const exUser=await User.findOne({where:{email}});
        if(exUser){
            req.flash('joinError','You already have duplicate emails');
            return res.redirect('/join');
        }
     
        const hash=await bcrypt.hash(password,12);
        await User.create({
            email,
            nick,
            password:hash,
        });
        return res.redirect('/login');
    }catch(error){
        console.error(error);
        return next(error);

    }
});
router.post('/login',isNotLoggedIn,(req,res,next)=>{
    passport.authenticate('local',(authError,user,info)=>{
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            req.flash('loginError',info.message);
            return res.redirect('/login');
        }
        return req.login(user,(loginError)=>{
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            console.log(req.session);
            return res.redirect('/');
        });
    })(req,res,next);
});

router.get('/logout',isLoggedIn,(req,res)=>{
    req.logOut();
    req.session.destroy();
    res.redirect('/login');
});

router.get('/google', passport.authenticate('google',{ scope:
    ['profile']}));

router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
}), (req, res) => {
  res.redirect('/');
});

router.get('/facebook', passport.authenticate('facebook'));
  router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
    res.redirect('/');
  });

module.exports=router;

