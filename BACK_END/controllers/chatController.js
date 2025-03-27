const Message = require("../models/Messenger");

// Lấy lịch sử tin nhắn giữa hai người
const getMessages = async (req, res) => {
  const { user } = req.query;
  try {
    const messages = await Message.find({ 
      $or: [{ sender: user }, { receiver: user }]
    }).sort({ timestamp: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy tin nhắn" });
  }
};

// Gửi tin nhắn
const sendMessage = async (data) => {
  try {
    const newMessage = new Message(data);
    await newMessage.save();
    return newMessage;
  } catch (error) {
    console.error("Lỗi khi gửi tin nhắn:", error);
  }
};

module.exports = { getMessages, sendMessage };
