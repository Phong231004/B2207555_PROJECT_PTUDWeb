<template>
  <div class="page">
    <!-- Sidebar -->
    <div class="sidebar">
      <h2>NỘI QUY HỆ THỐNG</h2>
      <div class="rules">
        <ul>
          <li>1. Độc giả phải đăng nhập để mượn sách.</li>
          <li>2. Nhân viên chỉ có quyền duyệt hoặc từ chối đơn mượn.</li>
          <li>3. Quản trị viên có quyền quản lý tất cả các hoạt động.</li>
          <li>4. Mỗi người chỉ mượn tối đa 3 cuốn sách.</li>
          <li>5. Mượn sách phải trả đúng hạn để tránh phạt.</li>
        </ul>
      </div>
    </div>

    <!-- Card Đăng Nhập -->
    <div class="card">
      <div class="header text-center mb-4">
        <h1>CHÀO MỪNG BẠN ĐẾN VỚI HỆ THỐNG</h1>
        <p style="color: black; font-size: 15px;">Vui lòng chọn vai trò để đăng nhập để sử dụng các chức năng</p>
      </div>

      <!-- Các nút đăng nhập -->
      <button @click="navigateToReaderLogin" class="btn btn-primary btn-lg btn-block">
        <i class="fas fa-user-circle"></i> Đăng Nhập Đọc Giả
      </button>
      <button @click="navigateToStaffLogin" class="btn btn-success btn-lg btn-block">
        <i class="fas fa-user-tie"></i> Đăng Nhập Nhân Viên
      </button>
      <button @click="navigateToAdministratorLogin" class="btn btn-warning btn-lg btn-block">
        <i class="fas fa-user-shield"></i> Đăng Nhập Quản Trị
      </button>

    </div>

    <!-- Footer -->
    <div class="footer">
      <p>&copy; 2025 Hệ Thống Mượn Sách</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginCard',
  methods: {
    navigateToReaderLogin() {
      window.location.href = 'ReaderLogin';
      console.log("Navigating to Reader Login");
    },
    navigateToStaffLogin() {
      window.location.href = 'StaffLogin';
      console.log("Navigating to Staff Login");
    },
    navigateToAdministratorLogin() {
      window.location.href = '/AdminLogin';
      console.log("Navigating to Staff Login");
    }
  }
};
</script>

<style scoped>
/* Áp dụng font mới */
    .page {
      font-family: 'K2D', sans-serif;
      background: linear-gradient(135deg, rgba(0, 102, 204, 0.8), rgba(0, 102, 204, 0.2));
      background-size: cover;
      background-position: center;
      color: white;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }

    /* Sidebar */
    .sidebar {
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      width: 350px;
      height: 100vh;
      padding: 40px;
      position: absolute;
      top: 0;
      left: 0;
      overflow-y: auto;
      border-radius: 0px 15px 15px 0px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .sidebar h2 {
      font-size: 28px;
      margin-bottom: 20px;
      color: #fff;
    }

    .sidebar ul {
      list-style: none;
      padding-left: 0;
    }

    .sidebar ul li {
      font-size: 18px;
      margin-bottom: 15px;
      transition: background 0.3s ease, padding 0.3s ease;
    }

    .sidebar ul li:hover {
      background-color: #007bff;
      border-radius: 5px;
      padding-left: 20px;
      cursor: pointer;
    }

    .sidebar ul li a {
      text-decoration: none;
      color: white;
      font-weight: bold;
    }

    /* Card đăng nhập */
    .card {
      border-radius: 20px;
      padding: 40px;
      width: 550px;
      box-shadow: 0px 15px 25px rgba(0, 0, 0, 0.2);
      background-color: rgba(255, 255, 255, 0.95);
      transition: transform 0.3s ease-in-out;
      position: relative;
      z-index: 2;
    }

    .card:hover {
      transform: translateY(-10px);
      box-shadow: 0px 25px 40px rgba(0, 0, 0, 0.2);
    }

    .card-body {
      padding: 30px;
      text-align: center;
    }
    .header {
      background-color: transparent; /* Xóa nền */
      border: none; /* Xóa viền */
      box-shadow: none; /* Xóa bóng đổ */
      padding: 0; /* Giảm khoảng cách thừa */
      text-align: center;
    }

    .header h1 {
      font-size: 25px;
      font-weight: bold;
      color: #333;
      margin-bottom: 20px;
    }

    .btn {
      font-size: 16px;
      padding: 12px 20px;
      border-radius: 10px;
      transition: all 0.3s ease;
      margin-bottom: 15px;
      width: 100%;
    }

    .btn:hover {
      transform: scale(1.05);
      box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
    }

    .btn-primary {
      background-color: #007bff;
      border: none;
    }

    .btn-success {
      background-color: #28a745;
      border: none;
    }

    .footer {
      position: absolute;
      bottom: 10px;
      width: 100%;
      text-align: center;
      color: #fff;
    }

    /* Nội quy */
    .rules {
      margin-top: 20px;
      font-size: 16px;
      color: white;
    }

    .rules ul {
      padding-left: 0;
    }

    .rules ul li {
      margin-bottom: 15px;
    }

    /* Hiệu ứng chuyển động cho nút */
    .btn-lg {
      transform: scale(1);
      transition: transform 0.3s ease-in-out;
    }

    .btn-lg:hover {
      transform: scale(1.1);
    }

    /* Thêm hiệu ứng fade-in cho nội dung */
    .card, .sidebar {
      animation: fadeIn 1s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }
</style>