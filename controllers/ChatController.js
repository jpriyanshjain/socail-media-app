import ChatModel from "../models/ChatModel.js";
import { ObjectId } from "mongodb";

export const createChat = async (req, res, next) => {
  const { senderId, receiverId } = req.body;

  const newChat = new ChatModel({
    members: [ObjectId(senderId), ObjectId(receiverId)],
  });
  try {
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const userChats = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const chat = await ChatModel.find({
      members: { $in: [ObjectId(userId)] },
    });
    res.status(200).json(chat);
  } catch (error) {
    next(error);
  }
};

export const findChat = async (req, res, next) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    next(error);
  }
};
