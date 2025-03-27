<template>
  <div class="page">
    <button class="btn btn-back" @click="goBack">Quay Lại</button>
    <div class="container">
    <div class="header">
        <h1 style="font-family: K2D">DANH SÁCH ĐÃ ĐĂNG KÝ CỦA {{ HoTenDG }}</h1>
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
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>Mã Sách</th>
              <th>Tên Sách</th>
              <th>Tác Giả</th>
              <th>Giá Niêm Yết</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in paginatedBooks" :key="book.MASACH">
              <td>{{ book.MASACH }}</td>
              <td>{{ book.TENSACH }}</td>
              <td>{{ book.TACGIA }}</td>
              <td>{{ book.DONGIA }} VND</td>
              <td><span :class="getStatusClass(book.status)">{{ book.status }}</span></td>
            </tr>
          </tbody>
        </table>

        <!-- Phân trang -->
        <nav>
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="prevPage">Trước</button>
            </li>
            <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
              <button class="page-link" @click="goToPage(page)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="nextPage">Tiếp</button>
            </li>
          </ul>
        </nav>

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
    name: "DocGiaXemDanhSachDaMuon",
    data() {
            return {
                HoTenDG: "",
                borrowedBooks: [],
                matchedBookIds: [],
                currentPage: 1,
                itemsPerPage: 5, // Số lượng sách hiển thị trên mỗi trang
            };
        },
    computed: {
        totalPages() {
            return Math.ceil(this.borrowedBooks.length / this.itemsPerPage);
        },
        paginatedBooks() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return this.borrowedBooks.slice(start, start + this.itemsPerPage);
        }
    },
    mounted() {
    this.loadDataFromLocalStorage();
    this.getBorrowedBookIds();
  },
    methods: {
        goBack() {
            // Đợi một chút rồi mới chuyển trang để đảm bảo localStorage đã bị xóa
            setTimeout(() => {
                this.$router.push('/ThuVienOnline');
            }, 100); // Đợi 100ms trước khi chuyển hướng
            },
        loadDataFromLocalStorage() {
            this.HoTenDG = localStorage.getItem("HoTenDG") || "Tên không tồn tại";
            const borrowedBooksData = localStorage.getItem("borrowedBooks");
            this.borrowedBooks = borrowedBooksData ? JSON.parse(borrowedBooksData) : [];
            console.log("Dữ liệu đọc giả:", this.HoTenDG);
            console.log("Dữ liệu sách:", this.borrowedBooks);
            this.getBorrowedBookIds(); // Gọi để lấy danh sách mã sách
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
        Onlie(){
          window.location.href = '/ThuVienOnline'; 
        },
        getBorrowedBookIds() {
            let ids = [];
            for (let i = 1; i < this.borrowedBooks.length; i += 2) {
            if (this.borrowedBooks[i] === this.HoTenDG) {
                ids.push(this.borrowedBooks[i - 1]); // ID sách nằm trước tên đọc giả
            }
            }
            this.matchedBookIds = ids;
            console.log("Danh sách ID sách:", this.matchedBookIds);
            this.fetchAllBookDetails(); // Gọi hàm để lấy chi tiết sách
        },

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
        async fetchAllBookDetails() {
            try {
                // Lấy danh sách trạng thái từ LocalStorage
                const evenIndexBooks = JSON.parse(localStorage.getItem("evenIndexBooks")) || [];

                // Dùng Promise.all() để lấy thông tin chi tiết của từng mã sách
                const bookDetailsArray = await Promise.all(
                    this.matchedBookIds.map(async (id) => {
                        const bookDetails = await this.getBookDetails(id);
                        if (!bookDetails) return null; // Bỏ qua nếu không lấy được thông tin sách

                        // Tìm trạng thái từ evenIndexBooks
                        let bookIndex = evenIndexBooks.indexOf(id);
                        let status = "đang chờ"; // Mặc định là "đang chờ"
                        if (bookIndex !== -1 && bookIndex % 2 === 0) {
                            status = evenIndexBooks[bookIndex + 1] || "đang chờ";
                        }

                        // Chuyển đổi trạng thái hiển thị
                        if (status === "approved") status = "Đã duyệt";
                        else if (status === "rejected") status = "Đã từ chối";
                        else status = "Đang chờ"; // Giữ mặc định nếu không có trạng thái hợp lệ

                        return {
                            ...bookDetails,
                            status: status, // Thêm trạng thái vào đối tượng sách
                        };
                    })
                );

                // Lọc bỏ giá trị null (nếu API bị lỗi)
                this.borrowedBooks = bookDetailsArray.filter((book) => book !== null);
                console.log("Danh sách sách đã mượn với trạng thái:", this.borrowedBooks);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sách:", error);
            }
        }, 
        // Xử lý chuyển trang
        prevPage() {
            if (this.currentPage > 1) this.currentPage--;
        },
        nextPage() {
            if (this.currentPage < this.totalPages) this.currentPage++;
        },
        goToPage(page) {
            this.currentPage = page;
        } ,
        getStatusClass(status) {
            if (status === "Đang chờ") return "status-pending";
            if (status === "Đã duyệt") return "status-approved";
            if (status === "Đã từ chối") return "status-rejected";
            return "";
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

    .page{
      background: linear-gradient(135deg, rgba(0, 102, 204, 0.8), rgba(0, 102, 204, 0.2));
      background-size: cover;
      background-position: center;
      color: white;
      height: 730px;
      width: 100%;
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
    .header h1 {
    font-family: "K2D", sans-serif;
    font-weight: bold;
    text-transform: uppercase; /* In hoa toàn bộ */
    margin-bottom: 20px;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  }
    /* Căn giữa nội dung bảng */
    .table {
    width: 100%;
    border-collapse: collapse;
    }

    .table th, 
    .table td {
    text-align: center; /* Căn giữa nội dung */
    vertical-align: middle; /* Căn giữa theo chiều dọc */
    padding: 10px;
    }

    .table thead {
    background-color: rgba(0, 102, 204, 0.9);
    color: white;
    font-weight: bold;
    text-transform: uppercase;
    }

    .table tbody tr:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.2);
    }

    .table tbody tr:hover {
    background-color: rgba(255, 255, 255, 0.3);
    }

    /* Căn giữa phần phân trang */
    .pagination {
    margin-top: 20px;
    }

    .pagination .page-item .page-link {
    background-color: rgba(0, 102, 204, 0.8);
    color: white;
    border: none;
    }

    .pagination .page-item.active .page-link {
    background-color: white;
    color: rgba(0, 102, 204, 0.9);
    font-weight: bold;
    }

    .pagination .page-item .page-link:hover {
    background-color: rgba(0, 102, 204, 1);
    color: white;
    }
    /* Trạng thái màu sắc */
.status-pending,
.status-approved,
.status-rejected {
    display: inline-block; /* Đảm bảo nằm gọn trong ô */
    width: 100px; /* Giới hạn chiều rộng */
    height: 30px;
    font-size: 15px; /* Chữ nhỏ hơn */
    padding: 2px 5px; /* Giảm padding */
    border-radius: 5px;
    text-align: center;
    margin: auto; /* Căn giữa */
}

/* Giữ nguyên màu sắc */
.status-pending {
    background-color: gray;
    color: white;
    font-weight: bold;
}

.status-approved {
    background-color: rgb(92, 254, 92);
    color: white;
    font-weight: bold;
}

.status-rejected {
    background-color: rgb(255, 66, 66);
    color: white;
    font-weight: bold;
}

/* Căn giữa trạng thái trong bảng */
.table td {
    text-align: center;
    vertical-align: middle;
}


</style>