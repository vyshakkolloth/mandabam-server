const { Server } = require('socket.io');

const chatController= require("../controller/chatController")



const socketService=(server)=>{

    const io=new Server(server,{
        cors: {
          origin:process.env.CORS,
          methods:["GET","POST"]
        }
      })
      const onlineUsers = new Map();
      
      io.on("connection",(socket)=>{
        // console.log(socket.id)
       
        // socket.on("add-user", (userId) => {
        //   onlineUsers.set(userId, socket.id);
        //   console.log(onlineUsers)
        // });
        socket.on("add-user", (chatId) => {
          // onlineUsers.set(userId, socket.id);
          // console.log(chatId)
          socket.join(chatId);
      
        });
      
      
        socket.on("send-message", (data) => {
          // console.log(data.to,"tpptptpttpt")
          // const id=data.to
          // const from=data.from
          // if(from){
            // console.log(from,"from")
            // console.log("result",onlineUsers.get(from),"4")
            // const reveseusersocket = onlineUsers.get(from);
            // if(reveseusersocket){
            //   console.log( reveseusersocket,"from")
            //   const f=socket.to(reveseusersocket).emit("msg-reverse", data);
            //   console.log(f)
            // }
          // }
          // console.log(data)
          io.emit("msg-recieve",data)
          chatController.addMessage(data)
      
      
        //  if(id){
        //   const sendUserSocket = onlineUsers.get(id);
        //   // console.log("result",onlineUsers.get(id))
        //   if (sendUserSocket) {
        //     console.log(sendUserSocket,"to")
        //     socket.to(sendUserSocket).emit("msg-recieve", data); 
        //   }
        //   }
          
        })
      
      
      })
}

module.exports= socketService