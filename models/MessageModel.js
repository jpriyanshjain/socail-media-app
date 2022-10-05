import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chats",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("Message", MessageSchema);
export default MessageModel;
