const mongoose=require('mongoose')
const chatSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userdata",
        required: true,
      },
      venue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venuedata",
        required: true,
      },
      messages: [
        {
          text: {
            type: String,
            required: true,
          },
          ID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
          },
          is_read: {
            type: Boolean,
            default: false
        },
        read_at: {
            type: Date
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
  
        },
      ],
    },
  );
  
  const ChatModel = mongoose.model("Chat", chatSchema);
  
  module.exports = ChatModel;