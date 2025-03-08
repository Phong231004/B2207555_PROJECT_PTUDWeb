const cors = require('cors');
const connectDB = require('./config/database');  // Đảm bảo đúng đường dẫn đến file database.js
const express = require('express');
const bodyParser = require('body-parser');
const bookRoutes = require('./routes/bookRoutes');
const readerRoutes = require('./routes/readerRoutes');
const staffRoutes = require('./routes/staffRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const publisherRoutes = require("./routes/publisherRoutes")
const borrowerDetailsRoutes = require('./routes/Borrower_details');  // Import route mới
const ChatBoxRoutes = require("./routes/ChatBoxRoutes");
const gtts = require("gtts");
const multer = require('multer'); // Thêm dòng này

// Kết nối MongoDB
connectDB();
const app = express();
// Middleware để xử lý body request
app.use(express.json());  // Dành cho JSON
app.use(express.urlencoded({ extended: true }));  // Dành cho form data
app.use(cors({
  origin: 'http://localhost:8080',  // Chỉ định cổng Vue.js
  credentials: true
}));

app.use("/chatbox", ChatBoxRoutes);
app.use('/api/books', bookRoutes); 
app.use('/api/staff', staffRoutes);
app.use('/api/reader', readerRoutes);
app.use('/api/publisher', publisherRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api', borrowerDetailsRoutes);  // Thêm route mới vào
// Chuyển văn bản thành giọng nói
app.post("/tts", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Vui lòng nhập văn bản" });
        }

        // Chuyển văn bản sang giọng nói và truyền trực tiếp
        const tts = new gtts(text, "vi");

        res.set({
            "Content-Type": "audio/mpeg",
            "Transfer-Encoding": "chunked"
        });

        tts.stream().pipe(res); // Truyền trực tiếp luồng âm thanh đến client
    } catch (error) {
        console.error("Lỗi server:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});
// Port
const PORT = process.env.PORT || 3000;  // Lấy cổng từ biến môi trường hoặc cổng mặc định

// Khởi động server và xử lý lỗi nếu có
app.listen(PORT, (err) => {
  if (err) {
    console.error(`Không thể khởi động server trên cổng ${PORT}:`, err);
  } else {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
  }
});
