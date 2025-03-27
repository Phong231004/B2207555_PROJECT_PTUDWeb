<template>
<div class="pagea">
    <!-- Sidebar Menu -->
    <div class="sidebar">
      <h2>MENU</h2>
      <p @click="BOOK_LOAN_REGISTRATION_FORM"><i class="fas fa-book"></i> ĐƠN ĐĂNG KÝ MƯỢN SÁCH</p>
      <p @click="SEARCH_FOR_BOOK_BORROWER_INFORMATION"><i class="fas fa-search"></i> TÌM KIẾM THÔNG TIN NGƯỜI MƯỢN SÁCH</p>
      <p @click="REGISTER_WHEN_COMING_TO_BORROW_BOOKS_IN_PERSON"><i class="fas fa-user-plus"></i> ĐĂNG KÝ KHI ĐẾN MƯỢN SÁCH TRỰC TIẾP</p>
      <p @click="UPDATEBOOKS"><i class="fas fa-plus"></i> CẬP NHẬT SỐ LƯỢNG SÁCH</p>
      <p @click="RETURNBOOKS"><i class="fas fa-plus"></i> DUYỆT TRẢ SÁCH</p>
    </div>

    <div class="container">
    <button class="btn btn-back" @click="goBack">Đăng Xuất</button>
      <div class="header">
        <h1 style="font-family: K2D">DANH SÁCH YÊU CẦU DUYỆT TRẢ</h1>
      </div>

    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Mã Sách</th>
          <th>Tên Sách</th>
          <th>Tác Giả</th>
          <th>Giá</th>
          <th>Trạng Thái</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in returnRequestedBooks" :key="book.id">
          <td>{{ book.id }}</td>
          <td>{{ book.title || "Đang tải..." }}</td>
          <td>{{ book.author || "Đang tải..." }}</td>
          <td>{{ book.price ? `${book.price} VNĐ` : "Đang tải..." }}</td>
          <td>
            <span class="badge bg-warning">Yêu Cầu Trả</span>
          </td>
          <td>
            <button class="btn btn-success btn-sm" @click="approveReturn(book.id)">
              Duyệt Trả
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="message" class="alert alert-success text-center mt-3">
      {{ message }}
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
      evenIndexBooks: [], // Danh sách trạng thái mượn sách
      returnRequestedBooks: [], // Danh sách sách có trạng thái "return_requested"
      message: ""
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      // Lấy danh sách trạng thái từ localStorage
      const evenIndexBooksData = localStorage.getItem("evenIndexBooks");
      this.evenIndexBooks = evenIndexBooksData ? JSON.parse(evenIndexBooksData) : [];

      // Lọc ra sách có trạng thái "return_requested"
      const bookIds = [];
      for (let i = 0; i < this.evenIndexBooks.length; i += 2) {
        if (this.evenIndexBooks[i + 1] === "return_requested") {
          bookIds.push(this.evenIndexBooks[i]);
        }
      }

      // Lấy chi tiết sách từ API
      const bookDetailsPromises = bookIds.map(async (bookId) => {
        try {
          const response = await fetch(`http://localhost:3000/api/books/book/${bookId}`);
          const bookData = await response.json();

          return {
            id: bookId,
            title: bookData.TENSACH || "Không có thông tin",
            author: bookData.TACGIA || "Không có thông tin",
            price: bookData.DONGIA || 0
          };
        } catch (error) {
          console.error(`Lỗi khi tải thông tin sách ${bookId}:`, error);
          return { id: bookId, title: "Lỗi tải dữ liệu", author: "", price: 0 };
        }
      });

      const allBooks = await Promise.all(bookDetailsPromises);
      this.returnRequestedBooks = allBooks;
    },
    goChat() {
      setTimeout(() => {
        window.location.href = '/StaffChat';
      }, 100);
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
        },
        RETURNBOOKS(){
          window.location.href = '/NhanVienDUyetTraSach';
        },

    async approveReturn(bookID) {
      // Tìm index của sách trong danh sách trạng thái
      const index = this.evenIndexBooks.indexOf(bookID);
      if (index !== -1 && this.evenIndexBooks[index + 1] === "return_requested") {
        // Cập nhật trạng thái thành "returned"
        this.evenIndexBooks[index + 1] = "returned";
        localStorage.setItem("evenIndexBooks", JSON.stringify(this.evenIndexBooks));

        // Gọi API cập nhật kho sách (cộng thêm 1)
        try {
          const response = await fetch(`http://localhost:3000/api/books/update-stock/${bookID}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ change: 1 }) // Cộng thêm 1 sách vào kho
          });

          if (!response.ok) {
            throw new Error("Lỗi cập nhật kho sách");
          }

          this.message = `Sách "${bookID}" đã được duyệt trả & cập nhật kho!`;
        } catch (error) {
          console.error("Lỗi cập nhật kho sách:", error);
          this.message = "Có lỗi khi cập nhật kho sách!";
        }

        this.loadData(); // Cập nhật danh sách sách
      }
    }
  }
};
</script>

<style scoped>
/* Tổng thể */
.pagea {
  background: linear-gradient(135deg, rgba(0, 102, 204, 0.8), rgba(0, 102, 204, 0.2));
  color: white;
  min-height: 100vh;
  display: flex;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background: #0066cc;
  padding: 20px;
  position: fixed;
  height: 100%;
  transition: 0.3s;
}

.sidebar h2 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 30px;
  text-transform: uppercase;
}

.sidebar p {
  padding: 12px;
  font-size: 18px;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 5px;
}

.sidebar p:hover {
  background: #004d99;
  transform: scale(1.05);
}

/* Nội dung */
.container {
  margin-left: 270px;
  padding: 20px;
  flex: 1;
}

h2.text-center {
  margin-bottom: 20px;
}

/* Bảng */
.table {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.table thead {
  background: #0066cc;
  color: white;
}

.table tbody tr:hover {
  background: #f1f9ff;
  cursor: pointer;
}

/* Huy hiệu trạng thái */
.badge.bg-warning {
  background: #ffc107;
  padding: 5px 10px;
  border-radius: 5px;
  color: black;
}

/* Nút bấm */
.btn-sm {
  padding: 5px 10px;
  font-size: 14px;
}

.btn-success {
  background: #28a745;
  border: none;
}

.btn-success:hover {
  background: #218838;
}

/* Chat Icon */
.messenger-icon {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  border: none;
  padding: 10px 15px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.messenger-icon i {
  margin-left: 5px;
  font-size: 20px;
  color: #0066cc;
}

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
</style>