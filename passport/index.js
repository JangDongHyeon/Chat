const local=require('./localStrategy');
const google = require( './googleStrategy' );
const facebook=require('./facebookStrategy');
const {User} = require('../models');

module.exports=(passport)=>{
    passport.serializeUser((user,done)=>{
    done(null,user.id);
    });

    passport.deserializeUser((id,done)=>{
        User.findOne({where:{id}})
        .then(user=>done(null,user))
        .catch(err=>done(err))
    });
   
    local(passport);
    google(passport);
    facebook(passport);
    
};
