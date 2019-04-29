const SocketIO = require('socket.io');
const axios = require('axios');
const { User,Room,sequelize } = require('./models');
module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: '/socket.io' });

  app.set('io', io);
  const room = io.of('/room');
  const chat = io.of('/chats');

  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
  });
  

  room.on('connection', (socket) => {
    console.log('room 네임스페이스에 접속');
    socket.on('disconnect', () => {
      console.log('room 네임스페이스 접속 해제');
    });


  });

  chat.on('connection', async (socket) => {
    console.log('chat 네임스페이스에 접속');
    const req = socket.request;
    console.log(req.session.passport.user);
    const user=await User.findOne({where:{id:req.session.passport.user}});

    const { headers: { referer } } = req;
    const roomId = referer
      .split('/')[referer.split('/').length - 1]
      .replace(/\?.+/, '');
      //const roomMax=await Room.findOne({where:{id:roomId}}); 
    socket.join(roomId,async ()=>{
    
      await Room.update({max:sequelize.literal('max + 1')},{where:{id:roomId}});
      socket.to(roomId).emit('join', {
        userz: 'system',
        chat: `${user.dataValues.nick}님이 입장하셨습니다.`,
      });
    });
 
    socket.on('disconnect', async () => {
        console.log('chat 네임스페이스 접속 해제');
        socket.leave(roomId);
        await Room.update({max:sequelize.literal('max - 1')},{where:{id:roomId}});
        const currentRoom = socket.adapter.rooms[roomId];
        const userCount = currentRoom ? currentRoom.length : 0;
        console.log("유저 카운터:"+userCount);
        if (userCount === 0) {
          axios.delete(`http://localhost:8005/chat/room/${roomId}`
        
          )
            .then(() => {
            
              console.log('방 제거 요청 성공');
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          socket.to(roomId).emit('exit', {
            userz: 'system',
            chat: `${user.dataValues.nick}님이 퇴장하셨습니다.`,
          });
        }
      });
    });
  };
