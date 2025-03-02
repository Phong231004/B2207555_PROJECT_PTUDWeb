const express = require("express");
const router = express.Router();
const axios = require("axios");

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

router.post("/chat", async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) return res.status(400).json({ reply: "Vui lòng nhập nội dung!" });

    try {
        // Dùng model hợp lệ (thay bằng model bạn lấy từ ListModels)
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`;

        const requestData = {
            contents: [{ role: "user", parts: [{ text: userMessage }] }]
        };

        const response = await axios.post(apiUrl, requestData, {
            headers: { "Content-Type": "application/json" }
        });

        console.log("Phản hồi từ Google API:", response.data);

        const replyText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi từ AI.";
        res.json({ reply: replyText });

    } catch (error) {
        console.error("Lỗi Google AI:", error.response?.data || error.message);
        res.status(500).json({ reply: "Xin lỗi, tôi không thể trả lời ngay bây giờ." });
    }
});

module.exports = router;
