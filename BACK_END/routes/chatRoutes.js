const express = require("express");
const { getMessages } = require("../controllers/chatController");

const router = express.Router();

// Route lấy lịch sử tin nhắn
router.get("/messages", getMessages);

module.exports = router;
