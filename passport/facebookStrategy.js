const FacebookStrategy = require('passport-facebook').Strategy; // 이 부분 추가
const {User} = require('../models');


module.exports = (passport) => {
    passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_SECRET_ID,
      callbackURL: 'http://localhost:8005/auth/facebook/callback',
      passReqToCallback: true,
    },async  (req, accessToken, refreshToken, profile, done) => {
        try{
         
            const exUser=await User.findOne({where:{snsId:profile.id,provider:'facebook'}});
            if(exUser){
                done(null,exUser);
            }else{
                const newUser=await User.create({                   
                    nick:profile.displayName,
                    snsId:profile.id,
                    provider:'facebook',
                });
                done(null,newUser);
            }
        }catch(error){
            console.error(error);
            done(error);
        }
    }));
};
