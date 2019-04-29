const LocalStratrgy=require('passport-local').Strategy;
const bcrypt=require('bcrypt');

const {User} =require('../models');

module.exports=(passport)=>{
    passport.use(new LocalStratrgy({
        usernameField:'email',
        passwordField:'password',
    },async (email,password,done)=>{
        try{
            const exUser=await User.findOne({where:{email}});
                      
            if(exUser){
                const result=await bcrypt.compare(password,exUser.password);
                if(result){
                    done(null,exUser);
                }else{
                    done(null,false,{message:'Passwords do not match'});
                }

            }else{
                done(null,false,{message:'가입되지 않는 회원입니다'});
            }
        }catch(error){
            console.error(error);
            done(error);
        }
    }));
};
