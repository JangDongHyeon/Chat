const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;
const {User} = require('../models');

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_ID,
      callbackURL: '/auth/google/callback',
      passReqToCallback: true,
    },async  (req, accessToken, refreshToken, profile, done) => {
        try{
            const exUser=await User.findOne({where:{snsId:profile.id,provider:'google'}});
            if(exUser){
                done(null,exUser);
            }else{
                const newUser=await User.create({                   
                    nick:profile.displayName,
                    snsId:profile.id,
                    provider:'google',
                });
                done(null,newUser);
            }
        }catch(error){
            console.error(error);
            done(error);
        }
    }));
};

