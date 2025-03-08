<template>
  <div class="page">
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
      <!-- Nút trở lại -->
      <button class="btn btn-back" @click="goBack">Đăng Xuất</button>
      <div class="header">
        <h1 style="font-family: K2D">DANH SÁCH ĐƠN ĐĂNG KÝ MƯỢN SÁCH</h1>
      </div>

      <!-- Thông báo "Không có đơn mượn nào" -->
      <div class="alert alert-warning" v-if="!paginatedBorrowedBooks || paginatedBorrowedBooks.length === 0">
        Không có đơn mượn nào.
      </div>

      <div class="card" v-else>
        <div class="card-body">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID Sách</th>
                <th>Tên Sách</th>
                <th>Tác Giả</th>
                <th>Giá</th>
                <th>Người Mượn</th>
                <th>Trạng Thái</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(book, index) in paginatedBorrowedBooks" :key="book.MASACH">
                <td>{{ book.MASACH }}</td>
                <td>{{ book.TENSACH }}</td>
                <td>{{ book.TACGIA }}</td>
                <td>{{ book.DONGIA }} VND</td>
                <td>{{ book.borrower }}</td>
                <td class="status">
                  <span v-if="book.status === 'approved'" class="status-approved">Duyệt</span>
                  <span v-else-if="book.status === 'rejected'" class="status-rejected">Từ Chối</span>
                </td>
                <td>
                  <button
                    class="btn btn-approved btn-change-status"
                    @click="changeStatus(book.MASACH, 'approved', index)"
                  >
                    Duyệt
                  </button>
                  <button
                    class="btn btn-rejected btn-change-status"
                    @click="changeStatus(book.MASACH, 'rejected', index)"
                  >
                    Từ Chối
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Phân trang -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Trang trước</button>
        <span>Trang {{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Trang sau</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
     return {
      borrowedBooks: [], // Danh sách sách đã mượn
      currentPage: 1, // Trang hiện tại
      itemsPerPage: 5, // Số mục trên mỗi trang
    };
  },
  async created() {
    await this.displayBorrowRequests(); // Tải danh sách đơn mượn khi component được tạo
  },
  computed: {
    // Tính toán danh sách sách đã mượn theo trang hiện tại
    paginatedBorrowedBooks() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.borrowedBooks.slice(start, end);
    },
    // Tính tổng số trang
    totalPages() {
      return Math.ceil(this.borrowedBooks.length / this.itemsPerPage);
    },
  },
  methods: {
    // Chuyển đến trang trước
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    // Chuyển đến trang sau
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
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
        },
    // Lấy thông tin chi tiết sách từ API
    async getBookDetails(MASACH) {
      try {
        const response = await fetch(`http://localhost:3000/api/books/book/${MASACH}`);
        if (!response.ok) {
          console.error("Lỗi:", response.status, response.statusText);
          return null;
        }
        return await response.json();
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sách:", error);
        return null;
      }
    },
    async displayBorrowRequests() {
      const borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
      let evenIndexBooks = JSON.parse(localStorage.getItem("evenIndexBooks")) || [];

      if (borrowedBooks.length === 0) return;

      this.borrowedBooks = []; // Xóa dữ liệu cũ trước khi cập nhật

      for (let i = 0; i < borrowedBooks.length; i += 2) {
        const bookID = borrowedBooks[i];
        const borrower = borrowedBooks[i + 1] || "Không xác định";

        // Kiểm tra trạng thái trước đó trong evenIndexBooks
        let bookIndex = evenIndexBooks.indexOf(bookID);
        let status = "đang chờ"; // Mặc định

        if (bookIndex !== -1 && bookIndex % 2 === 0) {
          status = evenIndexBooks[bookIndex + 1] || "đang chờ";
        } else {
          // Nếu chưa có trong evenIndexBooks, thêm vào
          evenIndexBooks.push(bookID);
          evenIndexBooks.push("đang chờ");
        }

        const bookDetails = await this.getBookDetails(bookID);
        if (bookDetails) {
          this.borrowedBooks.push({
            ...bookDetails,
            borrower: borrower,
            status: status, // Giữ trạng thái trước đó
          });
        }
      }

      // Cập nhật evenIndexBooks vào LocalStorage
      localStorage.setItem("evenIndexBooks", JSON.stringify(evenIndexBooks));

      console.log("Danh sách sách mượn với trạng thái:", this.borrowedBooks);
    },
    async changeStatus(MASACH, status, index) {
    let evenIndexBooks = JSON.parse(localStorage.getItem("evenIndexBooks")) || [];
    let bookIndex = evenIndexBooks.indexOf(MASACH);

    if (bookIndex !== -1 && bookIndex % 2 === 0) {
      let statusIndex = bookIndex + 1;
      evenIndexBooks[statusIndex] = status; // Cập nhật trạng thái

      if (status === "approved") {
        this.borrowedBooks[index].status = "approved";
      } else if (status === "rejected") {
        await this.updateBookStock(MASACH);
        this.borrowedBooks.splice(index, 1); // Xóa đơn mượn khỏi danh sách
      }

      // Cập nhật vào LocalStorage
      localStorage.setItem("evenIndexBooks", JSON.stringify(evenIndexBooks));
    }
  },
    // Cập nhật số lượng sách trong kho
    async updateBookStock(MASACH) {
      try {
        const response = await fetch(`http://localhost:3000/api/books/update-stock/${MASACH}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "increase" }),
        });
        if (response.ok) {
          alert(`Cập nhật số lượng sách ${MASACH} thành công!`);
        } else {
          console.log(`Lỗi khi cập nhật số lượng sách ${MASACH}`);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API cập nhật số lượng sách:", error);
      }
    },
  },
};
</script>

<style scoped>
/* Cải thiện giao diện */
    .page {
      background: linear-gradient(135deg, rgba(0, 102, 204, 0.8), rgba(0, 102, 204, 0.2));
      background-size: cover;
      background-position: center;
      color: white;
      height: 1100px;
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

    .table {
      background-color: rgba(255, 255, 255, 0.9);
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .table thead {
      background-color: #0066cc;
      color: white;
    }

    .table tbody tr:hover {
      background-color: #f1f9ff;
      cursor: pointer;
    }

    .status {
      text-align: center;
    }

    .status-approved {
      background-color: #28a745;
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
    }

    .status-rejected {
      background-color: #dc3545;
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
    }

    .card {
      margin-top: 20px;
    }

    .btn-change-status {
      cursor: pointer;
      padding: 5px 10px;
      border-radius: 5px;
      border: none;
    }

    .btn-approved {
      background-color: #28a745;
      color: white;
    }

    .btn-rejected {
      background-color: #dc3545;
      color: white;
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

    /* Thông báo khi không có đơn mượn */
    #message {
      display: none;
    }

    /* Thêm hiệu ứng cho các nút */
    .btn:hover {
      transition: all 0.3s ease;
      transform: scale(1.1);
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
    .table {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* Đảm bảo không bị tràn */
  }

  .table thead {
    background-color: #0066cc;
    color: white;
    text-transform: uppercase;
  }

  .table th, .table td {
    padding: 12px 15px;
    text-align: center;
    vertical-align: middle;
  }

  .table tbody tr {
    transition: background-color 0.3s ease-in-out;
  }

  .table tbody tr:hover {
    background-color: #f0faff;
    transform: scale(1.01);
  }

  .status {
    font-weight: bold;
    padding: 6px 12px;
    border-radius: 20px;
    display: inline-block;
  }

  .status-approved {
    background-color: #28a745;
    color: white;
  }

  .status-rejected {
    background-color: #dc3545;
    color: white;
  }

  .btn-change-status {
    font-size: 0.9rem;
    padding: 6px 12px;
    border-radius: 20px;
    border: none;
    transition: all 0.3s ease;
  }

  .btn-approved {
    background-color: #28a745;
    color: white;
  }

  .btn-rejected {
    background-color: #dc3545;
    color: white;
  }

  .btn-change-status:hover {
    transform: scale(1.1);
  }
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #003e7b;
  color: white;
  border: none;
  padding: 8px 16px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:disabled {
  background-color: #0092fa;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background-color: #004d99;
}

.pagination span {
  margin: 0 10px;
  font-size: 16px;
  color: #333;
}
.table th,
.table td {
  text-align: center; /* Căn giữa nội dung */
  vertical-align: middle; /* Căn giữa theo chiều dọc */
}

.status {
  display: flex;
  justify-content: center;
  align-items: center;
}

.status-approved,
.status-rejected {
  display: inline-block;
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.75rem;
}

.btn-change-status {
  display: inline-block;
  padding: 6px 15px;
  margin: 5px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
}

.btn-approved {
  background-color: #28a745;
  color: white;
  border: none;
}

.btn-rejected {
  background-color: #dc3545;
  color: white;
  border: none;
}

.btn-change-status:hover {
  transform: scale(1.1);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

/* Điều chỉnh phần sidebar đẹp hơn */
.sidebar {
  width: 260px;
  padding-top: 30px;
}

.sidebar p {
  font-size: 16px;
  padding: 12px;
  transition: all 0.3s;
}

.sidebar p:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}
</style>