<template>
  <div class="pagecontent">
    <!-- Sidebar Menu -->
    <div class="sidebar">
      <h2>MENU</h2>
      <p @click="BOOK_LOAN_REGISTRATION_FORM"><i class="fas fa-book"></i> ĐƠN ĐĂNG KÝ MƯỢN SÁCH</p>
      <p @click="SEARCH_FOR_BOOK_BORROWER_INFORMATION"><i class="fas fa-search"></i> TÌM KIẾM THÔNG TIN NGƯỜI MƯỢN SÁCH</p>
      <p @click="REGISTER_WHEN_COMING_TO_BORROW_BOOKS_IN_PERSON"><i class="fas fa-user-plus"></i> ĐĂNG KÝ KHI ĐẾN MƯỢN SÁCH TRỰC TIẾP</p>
      <p @click="UPDATEBOOKS"><i class="fas fa-plus"></i> CẬP NHẬT SỐ LƯỢNG SÁCH</p>
      <p @click="RETURNBOOKS"><i class="fas fa-plus"></i> DUYỆT TRẢ SÁCH</p>
    </div>
    
    <!-- Main Content -->
    <div class="content">
      <button class="btn btn-back" @click="goBack">Đăng Xuất</button>
      <div class="header">
        <h1>ĐĂNG KÝ MƯỢN SÁCH TRỰC TIẾP</h1>
      </div>
      
      <!-- Form Theo dõi sách -->
      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label for="MADOCGIA" class="form-label">Mã Đọc Giả:</label>
          <input type="text" v-model="formData.MADOCGIA" class="form-control" required>
        </div>
        <div class="mb-3">
          <label for="MASACH" class="form-label">Mã Sách:</label>
          <input type="text" v-model="formData.MASACH" class="form-control" required>
        </div>
        <div class="mb-3">
          <label for="MSNV" class="form-label">Mã Nhân Viên:</label>
          <input type="text" v-model="formData.MSNV" class="form-control" required>
        </div>
        <div class="mb-3">
          <label for="NGAYMUON" class="form-label">Ngày Mượn:</label>
          <input type="date" v-model="formData.NGAYMUON" class="form-control">
        </div>
        <button type="submit" class="btn btn-primary">Thêm Thông Tin Mượn Sách</button>
      </form>
      
      <h2 class="mt-5" style="color: black;">Danh Sách Quản Lý Mượn Sách</h2>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>MÃ ĐỌC GIẢ</th>
            <th>MÃ SÁCH</th>
            <th>MÃ NHÂN VIÊN</th>
            <th>NGÀY MƯỢN</th>
            <th>NGÀY TRẢ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td>{{ transaction.MADOCGIA }}</td>
            <td>{{ transaction.MASACH }}</td>
            <td>{{ transaction.MSNV }}</td>
            <td>{{ formatDate(transaction.NGAYMUON) }}</td>
            <td>{{ formatDate(transaction.NGAYTRA) }}</td>
          </tr>
        </tbody>
      </table>
      <button class="btn btn-success" @click="exportExcel">Xuất Excel</button>
    </div>
    <button class="messenger-icon" @click="goChat">
      <span class="chat-text" style="color: black;">Chat</span>
      <i class="bi bi-chat-dots"></i>
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        MADOCGIA: '',
        MASACH: '',
        MSNV: '',
        NGAYMUON: ''
      },
      transactions: []
    };
  },
  methods: {
    goBack() {
      // Đợi một chút rồi mới chuyển trang để đảm bảo localStorage đã bị xóa
      setTimeout(() => {
        this.$router.push('/StaffLogin');
      }, 100); // Đợi 100ms trước khi chuyển hướng
    },
    goChat() {
      setTimeout(() => {
        window.location.href = '/StaffChat';
      }, 100);
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
        },
        RETURNBOOKS(){
          window.location.href = '/NhanVienDUyetTraSach';
        },
    async loadTransactions() {
      try {
        const response = await fetch('http://localhost:3000/api/transactions');
        if (response.ok) {
          this.transactions = await response.json();
        } else {
          alert('Không thể lấy danh sách giao dịch.');
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách:', error);
        alert('Có lỗi xảy ra khi tải danh sách.');
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    },
    async submitForm() {
      try {
        const response = await fetch('http://localhost:3000/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.formData)
        });
        if (response.ok) {
          alert('Đã thêm thành công!');
          this.loadTransactions();
        } else {
          alert('Lỗi khi thêm thông tin mượn sách!');
        }
      } catch (error) {
        console.error('Lỗi khi gửi dữ liệu:', error);
        alert('Có lỗi xảy ra khi thêm dữ liệu.');
      }
    },
    async exportExcel() {
      alert('Chức năng xuất Excel chưa được triển khai!');
    }
  },
    mounted() {
    this.loadTransactions();
  }
};
</script>
<style scoped>
    .messenger-icon {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #0078FF;
  color: white;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 50px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 120, 255, 0.7);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.messenger-icon:hover {
  box-shadow: 0 0 20px rgba(0, 120, 255, 1);
}
   
/* Cải thiện giao diện */
    .pagecontent {
      background: linear-gradient(135deg, rgba(0, 102, 204, 0.8), rgba(0, 102, 204, 0.2));
      background-size: cover;
      background-position: center;
      color: white;
      height: 1000px;
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