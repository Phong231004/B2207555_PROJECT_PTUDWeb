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

    <!-- Nút trở lại -->
    <button class="btn btn-back" @click="goBack">Đăng Xuất</button>

    <!-- Main Content -->
    <div class="container">
      <div class="header">
        <h2 class="text-center mt-4">TRA CỨU VÀ CẬP NHẬT SỐ LƯỢNG SÁCH</h2>
      </div>

      <!-- Form tìm kiếm sách -->
      <div class="mb-3">
        <label for="bookId" class="form-label">Nhập ID sách:</label>
        <input
          type="text"
          id="bookId"
          class="form-control"
          placeholder="Nhập ID sách"
          v-model="bookId"
        />
      </div>
      <button class="btn btn-primary w-100" @click="fetchBook">
        <i class="fas fa-search"></i> Tìm sách
      </button>

      <!-- Thông tin sách -->
      <div id="bookInfo" class="mt-4" v-if="book">
        <h3 class="text-center">THÔNG TIN SÁCH</h3>
        <p><strong>Tên sách:</strong> {{ book.TENSACH }}</p>
        <p><strong>Đơn giá:</strong> {{ book.DONGIA }}</p>
        <p><strong>Số quyển:</strong> {{ book.SOQUYEN }}</p>
        <p><strong>Nhà xuất bản:</strong> {{ book.NHAXUATBAN }}</p>
        <p><strong>Tác giả:</strong> {{ book.TACGIA }}</p>

        <!-- Form cập nhật số lượng -->
        <div class="mb-3">
          <label for="newQuantity" class="form-label">Nhập số lượng thêm:</label>
          <input
            type="number"
            id="newQuantity"
            class="form-control"
            v-model="newQuantity"
          />
        </div>
        <button class="btn btn-success w-100" @click="updateQuantity">
          <i class="fas fa-sync-alt"></i> Cập nhật
        </button>
      </div>
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
      bookId: "", // ID sách nhập vào
      newQuantity: 0, // Số lượng thêm
      book: null, // Thông tin sách tìm được
    };
  },
  methods: {
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
        },
        RETURNBOOKS(){
          window.location.href = '/NhanVienDUyetTraSach';
        },
    // Tìm sách theo ID
    async fetchBook() {
      if (!this.bookId) {
        alert("Vui lòng nhập ID sách!");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/books/${this.bookId}`);
        if (response.ok) {
          this.book = await response.json();
        } else {
          alert("Không tìm thấy sách với ID đã nhập!");
          this.book = null;
        }
      } catch (error) {
        console.error("Lỗi khi tìm sách:", error);
        alert("Đã xảy ra lỗi khi tìm sách!");
      }
    },
    goChat() {
      setTimeout(() => {
        window.location.href = '/StaffChat';
      }, 100);
    },
    // Cập nhật số lượng sách
    async updateQuantity() {
      if (!this.bookId || this.newQuantity <= 0) {
        alert("Vui lòng nhập số lượng hợp lệ!");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/books/updateBooks/${this.bookId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ additionalQuantity: this.newQuantity }),
        });

        if (response.ok) {
          const result = await response.json();
          alert("Cập nhật thành công!");
          this.book.SOQUYEN = result.updatedBook.SOQUYEN; // Cập nhật số lượng hiển thị
        } else {
          alert("Cập nhật thất bại!");
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật số lượng:", error);
        alert("Đã xảy ra lỗi khi cập nhật số lượng!");
      }
    },
  },
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
      .pagecontent{
            background: linear-gradient(135deg, rgba(0, 102, 204, 0.8), rgba(0, 102, 204, 0.2));
            color: white;
            font-family: "K2D", sans-serif;
            height: 1000px;
        }
        .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            width: 300px;
            height: 100%;
            background-color: #0066cc;
            padding-top: 20px;
            transition: all 0.3s ease;
            z-index: 999;
        }
        .sidebar h2 {
            text-align: center;
            color: white;
            font-size: 1.8rem;
            text-transform: uppercase;
            margin-bottom: 30px;
        }
        .sidebar p {
            color: white;
            padding: 15px 20px;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.3s;
            border-radius: 5px;
            position: relative;
        }
        .sidebar p:hover {
            background-color: #004d99;
            transform: scale(1.05);
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
        }
        .sidebar p::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            width: 5px;
            height: 60%;
            background-color: #ff6347;
            transform: translateY(-50%);
            transition: all 0.3s;
        }
        .sidebar p:hover::before {
            width: 8px;
        }
        .container {
            margin-left: 400px;
            padding: 20px;
            max-width: 800px;
        }
        #bookInfo {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
            margin-top: 15px;
            color: black;
        }
        button {
            transition: all 0.3s ease-in-out;
        }
        button:hover {
            transform: scale(1.05);
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
</style>