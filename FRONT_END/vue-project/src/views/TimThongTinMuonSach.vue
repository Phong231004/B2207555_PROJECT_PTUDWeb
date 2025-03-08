<template>
  <div class="pagecontent">
    <!-- Sidebar Menu -->
    <div class="sidebar">
      <h2>MENU</h2>
      <p @click="BOOK_LOAN_REGISTRATION_FORM"><i class="fas fa-book"></i> ĐƠN ĐĂNG KÝ MƯỢN SÁCH</p>
      <p @click="SEARCH_FOR_BOOK_BORROWER_INFORMATION"><i class="fas fa-search"></i> TÌM KIẾM THÔNG TIN NGƯỜI MƯỢN SÁCH</p>
      <p @click="REGISTER_WHEN_COMING_TO_BORROW_BOOKS_IN_PERSON"><i class="fas fa-user-plus"></i> ĐĂNG KÝ KHI ĐẾN MƯỢN SÁCH TRỰC TIẾP</p>
      <p @click="UPDATEBOOKS"><i class="fas fa-plus"></i> CẬP NHẬT SỐ LƯỢNG SÁCH</p>
    </div>

    <!-- Main Content -->
    <div class="content">
      <button class="btn btn-back" @click="goBack">Đăng Xuất</button>
      <div class="header">
        <h1>TÌM THÔNG TIN NGƯỜI MƯỢN SÁCH</h1>
      </div>

      <div class="card">
        <div class="card-body">
          <form @submit.prevent="fetchBorrowerInfo">
            <div class="mb-3">
              <label for="MADOCGIA" class="form-label">Mã Đọc Giả:</label>
              <input v-model="MADOCGIA" type="text" id="MADOCGIA" class="form-control" placeholder="Nhập mã đọc giả" required>
            </div>
            <button type="submit" class="btn btn-primary w-100">Tìm Thông Tin</button>
          </form>
        </div>
      </div>

      <div v-if="borrowers.length" class="mt-5">
        <h3 class="text-center text-dark">Danh Sách Mượn Sách</h3>
        <table class="table table-hover table-striped table-bordered">
          <thead>
            <tr>
              <th>Đọc Giả</th>
              <th>Ngày Sinh</th>
              <th>Giới Tính</th>
              <th>Địa Chỉ</th>
              <th>Điện Thoại</th>
              <th>Tên Sách</th>
              <th>Đơn Giá</th>
              <th>Số Quyển</th>
              <th>Tên NXB</th>
              <th>Tác Giả</th>
              <th>Họ Tên Nhân Viên</th>
              <th>Chức Vụ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in borrowers" :key="item.MADOCGIA">
              <td>{{ item.HOTEN }}</td>
              <td>{{ new Date(item.NGAYSINH).toLocaleDateString() }}</td>
              <td>{{ item.PHAI }}</td>
              <td>{{ item.DIACHI }}</td>
              <td>{{ item.DIENTHOAI }}</td>
              <td>{{ item.TENSACH }}</td>
              <td>{{ item.DONGIA }}</td>
              <td>{{ item.SOQUYEN }}</td>
              <td>{{ item.TENNXB }}</td>
              <td>{{ item.TACGIA }}</td>
              <td>{{ item.HOTENNV }}</td>
              <td>{{ item.CHUCVU }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      MADOCGIA: "",
      borrowers: []
    };
  },
  methods: {
    async fetchBorrowerInfo() {
      try {
        const response = await fetch(`http://localhost:3000/api/borrower-details?MADOCGIA=${this.MADOCGIA}`);
        if (!response.ok) throw new Error("Không tìm thấy dữ liệu.");
        this.borrowers = await response.json();
      } catch (error) {
        alert(error.message);
      }
    },
    goBack() {
      // Đợi một chút rồi mới chuyển trang để đảm bảo localStorage đã bị xóa
      setTimeout(() => {
        this.$router.push('/StaffLogin');
      }, 100); // Đợi 100ms trước khi chuyển hướng
    },
        BOOK_LOAN_REGISTRATION_FORM() {
          window.location.href = '/DanhSachDonDangKyMuon';
        },
        SEARCH_FOR_BOOK_BORROWER_INFORMATION() {
          window.location.href = '/TimThongTinMuonSach';
        },
        REGISTER_WHEN_COMING_TO_BORROW_BOOKS_IN_PERSON() {
          window.location.href = '/DangKyMuonSachTrucTiep';
        },
        UPDATEBOOKS(){
          window.location.href = '/CapNhatSoLuongSach';
        }
  }
};
</script>

<style>
/* Cải thiện giao diện */
    .pagecontent {
      background: linear-gradient(135deg, rgba(0, 102, 204, 0.8), rgba(0, 102, 204, 0.2));
      background-size: cover;
      background-position: center;
      color: white;
    }

    .header {
      background-color: rgba(0, 102, 204, 0.9);
      color: white;
      padding: 40px 0;
      text-align: center;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      font-size: 2rem;
    }

    /* Cải tiến bảng */
    .table {
      background-color: rgba(255, 255, 255, 0.9);
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      overflow-x: auto;
      margin-top: 30px;
    }

    .table th, .table td {
      text-align: center;
      vertical-align: middle;
    }

    .table thead {
      background-color: #0066cc;
      color: white;
    }

    .table tbody tr:hover {
      background-color: #f1f9ff;
      cursor: pointer;
    }

    /* Thêm đường viền và cải tiến bố cục */
    .table-bordered th, .table-bordered td {
      border: 1px solid #ddd;
    }

    /* Cải thiện các ô trong bảng */
    .table td {
      font-size: 0.9rem;
      padding: 10px;
    }
    /* Sidebar */
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      width: 250px;
      background-color: #0066cc;
      padding-top: 20px;
      font-family: "K2D";
      transition: all 0.3s ease;
      z-index: 999; /* Đảm bảo sidebar nằm trên các phần khác */
    }

    .sidebar h2 {
      text-align: center;
      color: white;
      font-size: 1.8rem;
      margin-bottom: 30px;
      text-transform: uppercase;
    }

    .sidebar p {
      color: white;
      padding: 15px 20px;
      text-decoration: none;
      display: block;
      margin-bottom: 10px;
      font-size: 18px;
      border-radius: 5px;
      transition: all 0.3s;
      position: relative;
    }

    .sidebar p:hover {
      background-color: #004d99;
      transform: scale(1.05);
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3); /* Thêm bóng khi hover */
    }

    .sidebar p::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 5px;
      height: 60%;
      background-color: #ff6347; /* Màu đường viền */
      transform: translateY(-50%);
      transition: all 0.3s;
    }

    .sidebar p:hover::before {
      width: 8px; /* Mở rộng đường viền khi hover */
    }

    .sidebar p {
      color: white;
      padding: 12px 20px;
      font-size: 18px;
      cursor: pointer;
      border-radius: 5px;
      transition: background-color 0.3s ease;
    }

    .sidebar p:hover {
      background-color: #004d99;
      transform: scale(1.05);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    .content {
      margin-left: 270px; /* Khoảng cách từ sidebar */
      padding: 20px;
      transition: all 0.3s ease;
      height: 750px;
    }

    .content h1 {
      font-size: 2.5rem;
      margin-bottom: 20px;
    }

    .header {
      background-color: rgba(0, 102, 204, 0.9);
      color: white;
      padding: 40px 0;
      text-align: center;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      font-size: 2rem;
    }

    .btn-back {
      position: fixed;
      top: 10px;
      right: 20px; /* Đổi từ left thành right */
      background-color: #ff6347; /* Màu nền cam đẹp */
      color: white;
      font-weight: bold;
      border: none;
      padding: 12px 24px;
      border-radius: 50px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      z-index: 1000;
    }

    .btn-back:hover {
      background-color: #ff4500; /* Màu cam đậm khi hover */
      transform: scale(1.1); /* Phóng to nhẹ khi hover */
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
      cursor: pointer; /* Đổi con trỏ khi hover */
    }

    .btn-back:focus {
      outline: none;
    }
    /* Nút trở lại */
    .btn-back {
      position: fixed;
      top: 10px;
      right: 20px; /* Đổi từ left thành right */
      background-color: #ff6347; /* Màu nền cam đẹp */
      color: white;
      font-weight: bold;
      border: none;
      padding: 12px 24px;
      border-radius: 50px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      z-index: 1000;
    }

    .btn-back:hover {
      background-color: #ff4500; /* Màu cam đậm khi hover */
      transform: scale(1.1); /* Phóng to nhẹ khi hover */
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
      cursor: pointer; /* Đổi con trỏ khi hover */
    }

    .btn-back:focus {
      outline: none;
    }

    /* Bỏ hover cho nút tìm thông tin */
    .btn-primary {
      transition: none;  /* Loại bỏ hiệu ứng hover */
    }
    
</style>
