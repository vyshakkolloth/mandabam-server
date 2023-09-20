const ChatModel= require("../Model/chatSchema")

const getMessage= async (req,res)=>{
    try {
        const id=req?.body?.data
        const result= await ChatModel.findOne(id)

        // console.log("object");
        res.status(200).json({message:"result",result:result})
    } catch (error) {
        res.status(500).json({message:"getMessage error", error:error})
    }
}

 const PostuserMessage=async(req,res)=>{
    try {
        // console.log(req.body.data,"dfdf")
        res.status(200).json({mesage:"kfjekf"})
        
    } catch (error) {
        res.status(500).json({message:"PostuserMessage error", error:error})
    }
 }

const addMessage=async(data)=>{
    try {
        const{id,to,from,senderType,text}=data
    // console.log(id,to,from,senderType,msg)
    const result= await ChatModel.updateOne({_id:id},{$push:{ messages:{
        text:text,
        senderType,
        
    }}})
    // console.log(result)
    } catch (error) {
       console.log(error) 
    }
    

}

//  const addMessagde = async(message,chatId)=>{
//     try {
//         const updateChat = await chatSchema.updateOne({_id:chatId},{$push:{
//             messages:{
//                 text:message.text,
//                 senderType:message.senderType,
//                 senderId:message.senderId,
//                 receiverId:message.receiver,
//                 timestamp:message.timestamp
//             }
//         }})
//     } catch (error) {
//         console.log(error);
//     }
// }


module.exports = { getMessage,PostuserMessage,addMessage}