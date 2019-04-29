const express = require('express');
const { Room,Chat,User } = require('../models');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

router.get('/room',isLoggedIn,async (req,res,next)=>{
    try{
      const rooms = await Room.findAll({});
      console.log(req.session);
      
        res.render('chatRoom',{rooms:rooms,headerCheck:false,user:req.user,roomError:req.flash('roomError')});
    }catch(error){
        console.error(error);
        next(error);
    }
   
});
router.get('/room/create',isLoggedIn,(req,res,next)=>{
  try{
    res.render('roomCreate',{headerCheck:false,user:req.user,roomError:req.flash('roomError')});
  }catch(error){
    console.error(error);
    next(error);
}
});


router.post('/room/create',isLoggedIn,async (req,res,next)=>{
    try{
        var userId;
       
        if(req.user.email){
           userId=await User.findOne({where:{email:req.user.email}});
        }else{
           userId=await User.findOne({where:{snsId:req.user.snsId}});
        }
       const titleEx= await Room.findOne({where:{title:req.body.title}})
       console.log(titleEx);
        if(!titleEx){

        await Room.create({
            title:req.body.title,
           
            owner:req.user.nick,
            password:req.body.password,
            language:req.body.language,
            userId:userId.id,
        });
  
      
        const newRoom = await Room.findOne({where:{title:req.body.title}}); 
         res.redirect(`/chat/room/${newRoom.id}?password=${req.body.password}`);
        }else{
          req.flash("roomError","방이있습니다 다른방을 입력하세요");
        return res.redirect("/chat/room/create");
        }
        } catch (error) {
        console.error(error);
        next(error);
      }
});

router.get('/room/:id',isLoggedIn, async (req, res, next) => {
    try {
   
      const room = await Room.findOne({where:{ id: req.params.id} });
    
      const io = req.app.get('io');
      if (!room) {
         
        req.flash('roomError', '존재하지 않는 방입니다.');
        return res.redirect('/chat/room');
      }
      if(room.password){
      if (room.password !== req.query.password) {
        req.flash('roomError', '비밀번호가 틀렸습니다.');
        return res.redirect('/chat/room');
      }
    }

    const chats = await Chat.findAll({where:{roomId: room.id} ,order: [['createdAt', 'ASC']] });


      return res.render('chat', {
        room,
        title: room.title,
        chats:chats,
        userq: 'user',
        userId:req.user.id,
        nick:req.user.nick,
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  });
  
  router.delete('/room/:id', async (req, res, next) => {
    try {
      await Room.destroy({where:{ id: req.params.id} });
      await Chat.destroy({where:{ roomId: req.params.id} });
      res.send('ok');
      setTimeout(() => {
        req.app.get('io').of('/room').emit('removeRoom', req.params.id);
      }, 2000);
    } catch (error) {
      console.error(error);
      next(error);
    }
  });

  router.get('/roomlist',isLoggedIn,async(req,res,next)=>{
   
    try{
   
      const rooms = await Room.findAll({});
      
        res.json(rooms);

    }catch(error){
        console.error(error);
      next(error);
    }
  });

  router.get('/chatPerson/:id',isLoggedIn,async(req,res,next)=>{
    try{
      var max=await Room.findAll({attributes:['max','userid'],where:{id:req.params.id}});
     // var nick=await User.findAll({attributes:['nick'], where:{id:max.}})
      console.log(max);
      res.json(max.max);
    }catch(error){
      console.error(error);
      next(error);
    }
  });

  router.post('/chatCreate/:id',isLoggedI , async (req, res, next) => {
    try {
   
   var room=await Room.findOne({where:{id:req.params.id}});
     


   
      await Chat.create({
        title:room.title,
        roomId: room.id,
        userChat:'user',
        chat: req.body.chat,
        userId:req.user.id,
        nick:req.user.nick,
      });
  
      req.app.get('io').of('/chats').to(req.params.id).emit('chats', {chat:req.body.chat,userId:req.user.id,nickz:req.user.nick});
     
      res.send('ok');
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
module.exports=router;