const cors = require("cors");
const connectDB = require("./config/database"); // Kết nối MongoDB
const express = require("express");
const http = require("http"); // Import http để tạo server
const { Server } = require("socket.io"); // Import socket.io
const bodyParser = require("body-parser");
const gtts = require("gtts");
const multer = require("multer");

// Import các route
const bookRoutes = require("./routes/bookRoutes");
const readerRoutes = require("./routes/readerRoutes");
const staffRoutes = require("./routes/staffRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const publisherRoutes = require("./routes/publisherRoutes");
const borrowerDetailsRoutes = require("./routes/Borrower_details");
const ChatBoxRoutes = require("./routes/ChatBoxRoutes");
const chatRoutes = require("./routes/chatRoutes");

// Import controller cho chat
const { sendMessage } = require("./controllers/chatController");

// Kết nối database
connectDB();

const app = express();
const server = http.createServer(app); // Tạo server HTTP từ Express app

// Middleware xử lý body request
app.use(express.json()); // Dành cho JSON
app.use(express.urlencoded({ extended: true })); // Dành cho form data

// Cấu hình CORS để kết nối với frontend Vue.js
app.use(
  cors({
    origin: "http://localhost:8080", // Chỉ định cổng Vue.js
    credentials: true,
  })
);

// Khai báo các API routes
app.use("/api/books", bookRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/reader", readerRoutes);
app.use("/api/publisher", publisherRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api", borrowerDetailsRoutes);
app.use("/chatbox", ChatBoxRoutes);
app.use("/api/chat", chatRoutes);

// API chuyển văn bản thành giọng nói (Text-to-Speech)
app.post("/tts", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Vui lòng nhập văn bản" });
    }

    // Chuyển văn bản thành giọng nói
    const tts = new gtts(text, "vi");

    res.set({
      "Content-Type": "audio/mpeg",
      "Transfer-Encoding": "chunked",
    });

    // Truyền trực tiếp luồng âm thanh đến client
    tts.stream().pipe(res);
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Router API
app.use("/api/chat", chatRoutes);

// Socket.io
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Tham gia vào một phòng chat riêng giữa người gửi và người nhận
  socket.on("joinChat", ({ username }) => {
    socket.join(username);
    console.log(`${username} đã tham gia phòng chat.`);
  });

  // Xử lý gửi tin nhắn
  socket.on("sendMessage", async (data) => {
    const newMessage = await sendMessage(data);
    // Gửi tin nhắn cho cả sender và receiver
    io.to(data.sender).emit("receiveMessage", newMessage);
    io.to(data.receiver).emit("receiveMessage", newMessage);
  });

  socket.on("disconnect", () => console.log(`User disconnected: ${socket.id}`));
});


// Chạy server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
