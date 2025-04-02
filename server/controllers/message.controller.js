import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

//for chatting
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const reciverId = req.params.id;
    const { message } = req.body;

    let converstion = await Conversation.findOne({
      participants: {
        $all: [senderId, reciverId],
      },
    });
    console.log(converstion, "converstion converstion");
    if (!converstion) {
      converstion = await Conversation.create({
        participants: [senderId, reciverId],
      });
    }
    const newMessage = await Message.create({
      senderId,
      reciverId,
      message,
    });
    if (newMessage) converstion.message.push(newMessage._id);
    await Promise.all([converstion.save(), newMessage.save()]);

    // implement socket io
    return res.status(200).json({
      newMessage,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const conversation = await conversation.find({
      participants: {
        $all: [senderId, receiverId],
      },
    });
    if (!conversation) {
      return res.status(200).json({
        success: true,
        message: [],
      });
    }

    return res.status(200).json({
        success:true,
        message:conversation?.message
    })
  } catch (error) {
    console.log(error);
  }
};
