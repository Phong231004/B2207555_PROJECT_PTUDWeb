<template>
  <div class="page">
    <button class="btn btn-primary position-absolute top-0 end-0 m-3" @click="goBack">Trở lại</button>
    
    <div class="chat-container">
      <div class="chat-header">Chatbot AI 🎤</div>

      <div class="chat-body" ref="chatBody">
        <div class="chat-message bot">Xin chào! Tôi có thể giúp gì cho bạn?</div>
        <div v-for="(msg, index) in messages" :key="index" :class="['chat-message', msg.sender]">{{ msg.text }}</div>
      </div>

      <div class="chat-footer">
        
        <!-- Nút ghi âm -->
        <button @click="startRecognition" class="btn btn-outline-secondary me-2">
          🎤 Mic
        </button>

        <input type="text" v-model="chatInput" class="form-control me-2" placeholder="Nhập tin nhắn..." @keypress.enter="sendMessage" />
        <button @click="sendMessage" class="btn btn-primary">Gửi</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatBoxAI",
  data() {
    return {
      chatInput: "",
      messages: [],
      recognition: null,
      ocrText: "",
      uploadedImages: [], // Lưu danh sách ảnh tải lên
    };
  },
  mounted() {
    this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    this.recognition.lang = "vi-VN";
    this.recognition.continuous = false;
    this.recognition.interimResults = true;

    this.recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript + " ";
        }
      }
      this.chatInput = transcript;
    };

    this.recognition.onspeechend = () => {
      this.recognition.stop();
      this.sendMessage();
    };
  },
  methods: {
    appendMessage(text, sender) {
      this.messages.push({ text, sender });
      this.$nextTick(() => {
        this.$refs.chatBody.scrollTop = this.$refs.chatBody.scrollHeight;
      });
    },
    async sendMessage() {
      if (!this.chatInput.trim()) return;
      this.appendMessage(this.chatInput, "user");
      let userMessage = this.chatInput;
      this.chatInput = "";
      this.appendMessage("Đang xử lý...", "bot");
      try {
        const response = await fetch("http://localhost:3000/chatbox/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage }),
        });
        const data = await response.json();
        this.messages[this.messages.length - 1].text = data.reply || "Không có phản hồi từ AI.";
        this.speakText(data.reply);
      } catch (error) {
        this.messages[this.messages.length - 1].text = "Xin lỗi, tôi không thể trả lời ngay bây giờ.";
      }
    },
    startRecognition() {
      this.chatInput = "";
      this.recognition.start();
    },
    async speakText(text) {
      try {
        const response = await fetch("http://localhost:3000/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        if (!response.ok) return;
        const blob = await response.blob();
        const audioURL = URL.createObjectURL(blob);
        const audio = new Audio(audioURL);
        audio.play();
      } catch (error) {
        console.error("Lỗi phát âm thanh:", error);
      }
    },
    goBack() {
      setTimeout(() => {
        this.$router.push("/ThuVienOnline");
      }, 100);
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

  },
};
</script>

<style>
.ocr-result {
  background: #e9f7ef;
  padding: 15px;
  border-radius: 10px;
  margin: 15px;
  text-align: center;
}
.page{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  background-image: url("https://thsp.ctu.edu.vn/images/upload/MssDiem/atl1.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  color: white;
}
.btn-primary {
      background-color: #007bff;
      border-color: #007bff;
    }

    .btn-primary:hover {
      background-color: #0056b3;
      border-color: #004085;
    }
.chat-container {
  width: 100%;
  max-width: 600px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}
.chat-header {
  background: #007bff;
  color: white;
  padding: 15px;
  text-align: center;
  font-weight: bold;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}
.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.chat-message {
  padding: 12px;
  border-radius: 10px;
  max-width: 75%;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.chat-message.user {
  background: #007bff;
  color: white;
  align-self: flex-end;
}
.chat-message.bot {
  background: #34c759;
  color: white;
  align-self: flex-start;
}
.chat-footer {
  display: flex;
  padding: 10px;
  background: #f1f1f1;
  border-top: 1px solid #ccc;
  align-items: center;
}
button {
  margin-left: 10px;
  padding: 10px 15px;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}
button:hover {
  background: #0056b3;
}
</style>