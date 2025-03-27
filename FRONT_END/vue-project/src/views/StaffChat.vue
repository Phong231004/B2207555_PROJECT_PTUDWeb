<template>
  <div class="page">
    <button class="btn btn-primary position-absolute top-0 end-0 m-3" @click="goBack">Trở lại</button>
    <div class="container-fluid chat-container d-flex flex-column">
      <h2 class="text-center py-2 bg-primary text-white">Chat với độc giả</h2>

      <!-- Khung hiển thị tin nhắn -->
      <div class="chat-box flex-grow-1">
        <div
          v-for="msg in messages"
          :key="msg._id"
          :class="['chat-message', msg.sender === username ? 'my-message' : 'other-message']">
          <strong>{{ msg.sender }}:</strong> {{ msg.message }}
        </div>
      </div>

      <!-- Ô nhập tin nhắn -->
      <div class="chat-input d-flex p-3">
        <input v-model="message" @keyup.enter="sendMessage" class="form-control" placeholder="Nhập tin nhắn..." />
        <button @click="sendMessage" class="btn btn-success ms-2">Gửi</button>
        <button @click="startVoiceRecognition" class="btn btn-warning ms-2">Ghi âm</button>
      </div>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import axios from "axios";

export default {
  data() {
    return {
      socket: null,
      messages: [],
      message: "",
      username: "Nhân viên", // Nhân viên
      receiver: "Đọc giả", // Độc giả
      recognition: null, // Đối tượng nhận diện giọng nói
    };
  },
  mounted() {
    this.socket = io("http://localhost:3000");

    // Tham gia vào phòng chat riêng
    this.socket.emit("joinChat", { username: this.username });

    // Nhận tin nhắn
    this.socket.on("receiveMessage", (msg) => {
      if (msg.sender === this.receiver || msg.sender === this.username) {
        this.messages.push(msg);
      }
    });

    // Lấy lịch sử tin nhắn từ API
    axios.get(`http://localhost:3000/api/chat/messages?user=${this.username}`).then((response) => {
      this.messages = response.data;
    });

    // Kiểm tra trình duyệt có hỗ trợ nhận diện giọng nói không
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      this.recognition.lang = "vi-VN"; // Chọn ngôn ngữ tiếng Việt
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event) => {
        this.message = event.results[0][0].transcript;
      };

      this.recognition.onerror = (event) => {
        console.error("Lỗi nhận diện giọng nói:", event.error);
      };
    } else {
      console.warn("Trình duyệt không hỗ trợ nhận diện giọng nói.");
    }
  },
  methods: {
    sendMessage() {
      if (this.message.trim() === "") return;

      const data = {
        sender: this.username,
        receiver: this.receiver,
        message: this.message,
      };

      this.socket.emit("sendMessage", data);
      this.message = "";
    },
    goBack() {
      setTimeout(() => {
        this.$router.push("/DanhSachDonDangKyMuon");
      }, 100);
    },
    startVoiceRecognition() {
      if (this.recognition) {
        this.recognition.start();
      } else {
        alert("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói!");
      }
    },
  },
};
</script>

<style scoped>
.btn-primary {
      background-color: #007bff;
      border-color: #007bff;
    }

    .btn-primary:hover {
      background-color: #0056b3;
      border-color: #004085;
    }
.page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("https://thsp.ctu.edu.vn/images/upload/MssDiem/atl1.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.chat-container {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 15px;
}

.chat-box {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f1f3f5;
  border-radius: 8px;
}

.chat-message {
  padding: 14px;
  border-radius: 20px;
  max-width: 75%;
  word-wrap: break-word;
  animation: fadeIn 0.3s ease-in-out;
  margin-bottom: 10px;
}

.my-message {
  background-color: #5cb85c;
  color: white;
  text-align: right;
  align-self: flex-end;
  margin-left: auto;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.other-message {
  background-color: #3498db;
  color: white;
  text-align: left;
  align-self: flex-start;
  margin-right: auto;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.chat-input input {
  flex-grow: 1;
  border-radius: 8px;
  padding: 10px;
}

button {
  transition: all 0.2s ease-in-out;
}
button:hover {
  transform: scale(1.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
