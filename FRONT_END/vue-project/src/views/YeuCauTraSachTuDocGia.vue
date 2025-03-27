<template>
  <div class="pagea">
    <button class="btn btn-back" @click="goBack">Quay Lại</button>
    <div class="container">
    <div class="header">
        <h1 style="font-family: K2D">YÊU CẦU TRẢ SÁCH ONLINE</h1>
      </div>
       <!-- Thanh điều hướng -->
    <nav class="nav-container">
      <div class="nav-item" @click="goToInfo">Thông Tin</div>
      <div class="nav-item" @click="returnbook">Trả sách</div>
      <div class="nav-item" @click="goChatStaff">Chat với nhân viên</div>
      <div class="nav-item" @click="Onlie">Thư viên Online</div>
    </nav>
    <div class="card">
      <div class="card-body">
        <table class="table table-bordered">
      <thead>
        <tr>
          <th>Tên Sách</th>
          <th>Tác Giả</th>
          <th>Giá</th>
          <th>Trạng Thái</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in approvedBooks" :key="book.id">
          <td>{{ book.title || "Đang tải..." }}</td>
          <td>{{ book.author || "Đang tải..." }}</td>
          <td>{{ book.price ? `${book.price} VNĐ` : "Đang tải..." }}</td>
          <td>
            <span v-if="book.status === 'approved'" class="badge bg-success">Đã Duyệt</span>
            <span v-else-if="book.status === 'return_requested'" class="badge bg-warning">Yêu Cầu Trả</span>
            <span v-else-if="book.status === 'returned'" class="badge bg-primary">Đã Duyệt Trả</span>
          </td>
          <td>
            <button 
              class="btn btn-danger btn-sm" 
              @click="requestReturn(book.id)" 
              :disabled="book.status === 'return_requested' || book.status === 'returned'"
            >
              {{ book.status === 'return_requested' ? 'Đã Yêu Cầu' : 'Yêu Cầu Trả' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="message" class="alert alert-success text-center mt-3">
      {{ message }}
    </div>
      </div>
    </div>
  </div>
  </div>
  <div style="text-align: center; font-family: 'K2D';">
    <p>Các quyển sách đã chuyển sang trạng thái đã duyệt đọc giả có thể đến trực tiếp thư viện để lấy và sử dụng sách</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      HoTenDG: localStorage.getItem("HoTenDG") || "", // Lấy tên độc giả từ localStorage
      borrowedBooks: [], // Danh sách sách đã mượn
      evenIndexBooks: [], // Trạng thái của các sách
      approvedBooks: [], // Danh sách sách có thể hiển thị
      message: ""
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      // Lấy danh sách sách đã mượn từ localStorage
      const borrowedBooksData = localStorage.getItem("borrowedBooks");
      this.borrowedBooks = borrowedBooksData ? JSON.parse(borrowedBooksData) : [];

      // Lấy danh sách trạng thái duyệt từ localStorage
      const evenIndexBooksData = localStorage.getItem("evenIndexBooks");
      this.evenIndexBooks = evenIndexBooksData ? JSON.parse(evenIndexBooksData) : [];

      // Lọc sách đã duyệt để hiển thị
      await this.filterApprovedBooks();
    },
    goToInfo() {
          window.location.href = '/DocGiaXemDanhSachDaMuon'; 
        },
        goChatStaff(){
          window.location.href = '/ReaderChat'; 
        },
        returnbook(){
          window.location.href = '/YeuCauTraSachTuDocGia'; 
        },
        goBack() {
            // Đợi một chút rồi mới chuyển trang để đảm bảo localStorage đã bị xóa
            setTimeout(() => {
                this.$router.push('/ThuVienOnline');
            }, 100); // Đợi 100ms trước khi chuyển hướng
            },
        Onlie(){
          window.location.href = '/ThuVienOnline'; 
        },
    async filterApprovedBooks() {
      const userBooks = this.borrowedBooks.filter((_, index) => 
        index % 2 === 0 && this.borrowedBooks[index + 1] === this.HoTenDG
      );

      const bookDetailsPromises = userBooks.map(async (book) => {
        const statusIndex = this.evenIndexBooks.indexOf(book);
        const status = (statusIndex !== -1) ? this.evenIndexBooks[statusIndex + 1] : "pending";

        // Chỉ hiển thị sách có trạng thái "approved", "return_requested", "returned"
        if (!["approved", "return_requested", "returned"].includes(status)) return null;

        try {
          const response = await fetch(`http://localhost:3000/api/books/book/${book}`);
          const bookData = await response.json();

          return {
            id: book,
            title: bookData.TENSACH || "Không có thông tin",
            author: bookData.TACGIA || "Không có thông tin",
            price: bookData.DONGIA || 0,
            status: status
          };
        } catch (error) {
          console.error(`Lỗi khi tải thông tin sách ${book}:`, error);
          return { id: book, title: "Lỗi tải dữ liệu", author: "", price: 0, status: status };
        }
      });

      const allBooks = await Promise.all(bookDetailsPromises);
      
      // Loại bỏ sách có trạng thái không mong muốn
      this.approvedBooks = allBooks.filter(book => book !== null);
    },

    requestReturn(bookID) {
      const index = this.evenIndexBooks.indexOf(bookID);
      if (index !== -1 && this.evenIndexBooks[index + 1] === "approved") {
        this.evenIndexBooks[index + 1] = "return_requested"; // Cập nhật trạng thái
        localStorage.setItem("evenIndexBooks", JSON.stringify(this.evenIndexBooks));
        this.message = `Yêu cầu trả sách "${bookID}" đã được gửi!`;
        this.loadData(); // Cập nhật lại danh sách
      }
    }
  }
};
</script>

<style scoped>
.nav-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  background: #f8f9fa;
  padding: 10px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.nav-item {
  padding: 12px 20px;
  background: linear-gradient(135deg, #ff1820, #ff4511);
  color: white;
  font-weight: bold;
  font-size: 18px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.nav-item:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.3);
}
.pagea{
      background: linear-gradient(135deg, rgba(0, 102, 204, 0.8), rgba(0, 102, 204, 0.2));
      background-size: cover;
      background-position: center;
      color: white;
      height: 730px;
      width: 100%;
    }
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.1);
}
.table th, .table td {
  text-align: center;
  vertical-align: middle;
}
.badge {
  padding: 5px 10px;
  font-size: 14px;
}
</style>
