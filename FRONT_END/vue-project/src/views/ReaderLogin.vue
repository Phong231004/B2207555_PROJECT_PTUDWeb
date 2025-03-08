<template>
  <div class="page">
    <div class="container d-flex justify-content-center align-items-center vh-100">
    <button class="btn btn-primary position-absolute top-0 end-0 m-3" @click="goBack">Trở lại Trang Chủ</button>
    <div class="card" style="width: 100%; max-width: 400px;">
      <div class="card-body">
        <h3 class="card-title text-center mb-4">ĐĂNG NHẬP ĐỌC GIẢ</h3>
        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="hoTen" class="form-label">Họ và tên:</label>
            <input type="text" id="hoTen" v-model="hoTen" class="form-control" required />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Mật khẩu:</label>
            <input type="password" id="password" v-model="password" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-primary w-100">Đăng nhập</button>
        </form>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hoTen: "",
      password: ""
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch("http://localhost:3000/api/reader/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ HOLOT: this.hoTen, PASSWORD: this.password })
        });
        
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("HoTenDG", this.hoTen);
          localStorage.setItem("PasswordDG", this.password);
          alert("Đăng nhập thành công");
          this.$router.push("/ThuVienOnline");
        } else {
          alert("Lỗi đăng nhập: " + data.message);
        }
      } catch (err) {
        console.error("Lỗi kết nối:", err);
        alert("Không thể kết nối đến server");
      }
    },
    goBack() {
      setTimeout(() => {
        this.$router.push("/");
      }, 100);
    }
  }
};
</script>
<style scoped>
.page {
      background: url('https://reviewedu.net/wp-content/uploads/2021/08/dai-hoc-can-tho-ctu1-1.jpg') 
                no-repeat center center fixed;
      background-size: cover;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      font-family: "K2D" ;
    }
    .card {
    background: rgba(255, 255, 255, 0.741);
    backdrop-filter: blur(10px); /* Hiệu ứng mờ kính */
    border-radius: 15px; /* Bo tròn góc */
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.3); /* Hiệu ứng đổ bóng */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    margin-right: 50%;
    }

  .card:hover {
    transform: translateY(-5px); /* Hiệu ứng nổi lên khi di chuột */
    box-shadow: 0px 15px 40px rgba(0, 0, 0, 0.4);
  }


    h3.card-title {
      color: #00458f;
    }

    .btn-primary {
      background-color: #007bff;
      border-color: #007bff;
    }

    .btn-primary:hover {
      background-color: #0056b3;
      border-color: #004085;
    }

    /* Nút trở lại ở góc trên phải */
    .btn-back {
      position: absolute;
      top: 20px;
      right: 20px;
      background-color: #007bff;
      border-color: #007bff;
    }

    .btn-back:hover {
      background-color: #0056b3;
      border-color: #0056b3;
    }
    .mb-3{
      font-size: 18px;
      color: black;
    }
      .form-control {
      font-size: 18px; /* Tăng kích thước chữ */
      padding: 12px; /* Tăng padding */
      border: 2px solid #007bff; /* Viền xanh */
      border-radius: 10px; /* Bo tròn góc */
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); /* Hiệu ứng bóng đổ */
      transition: all 0.3s ease-in-out; /* Hiệu ứng mượt mà */
    }

    .form-control:focus {
      border-color: #0056b3; /* Đổi màu viền khi nhập */
      box-shadow: 0 4px 15px rgba(0, 91, 187, 0.5); /* Hiệu ứng nổi bật */
      outline: none; /* Loại bỏ viền mặc định */
    }
</style>