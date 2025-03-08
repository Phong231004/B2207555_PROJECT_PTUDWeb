<template>
  <div class="pagecontent">
    <!-- Sidebar Menu -->
    <div class="sidebar">
      <h3 class="text-white text-center">MENU</h3>
      <p @click="ADD_NEW_STAFF"><i class="fas fa-user"></i> THÊM NHÂN SỰ MỚI</p>
      <p @click="ADD_NEW_BOOK"><i class="fas fa-book"></i> THÊM SÁCH MỚI</p>
      <p @click="ADD_NEW_READER"><i class="fas fa-id-badge"></i> THÊM ĐỌC GIẢ MỚI</p>
      <p @click="ADD_NEW_PUBLISHER"><i class="fas fa-industry"></i> THÊM NHÀ XUẤT BẢN MỚI</p>
    </div>

    <!-- Content Section -->
    <div class="content">
      <!-- Nút trở lại -->
      <button class="btn btn-back" @click="goBack">Đăng Xuất</button>
      <div class="header">
        <h1>THÊM SÁCH MỚI</h1>
      </div>

      <!-- Form Thêm Sách -->
      <div class="card p-4 mb-4">
        <form id="bookForm" @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="Ma_Sach" class="form-label">Mã sách:</label>
            <input type="text" id="Ma_Sach" v-model="bookData.MASACH" class="form-control" required>
          </div>

          <div class="mb-3">
            <label for="Ten_Sach" class="form-label">Tên Sách:</label>
            <input type="text" id="Ten_Sach" v-model="bookData.TENSACH" class="form-control" required>
          </div>

          <div class="mb-3">
            <label for="Don_Gia" class="form-label">Đơn Giá:</label>
            <input type="text" id="Don_Gia" v-model="bookData.DONGIA" class="form-control" required>
          </div>

          <div class="mb-3">
            <label for="Nam_Xuat_Ban" class="form-label">Năm Xuất Bản:</label>
            <input type="text" id="Nam_Xuat_Ban" v-model="bookData.NHAXUATBAN" class="form-control" required>
          </div>

          <div class="mb-3">
            <label for="Ma_Nha_Xuat_Ban" class="form-label">Mã Nhà Xuất Bản:</label>
            <input type="text" id="Ma_Nha_Xuat_Ban" v-model="bookData.MANXB" class="form-control" required>
          </div>

          <div class="mb-3">
            <label for="Tac_Gia" class="form-label">Tác Giả:</label>
            <input type="text" id="Tac_Gia" v-model="bookData.TACGIA" class="form-control" required>
          </div>

          <button type="submit" class="btn btn-primary btn-custom">Thêm Sách</button>
        </form>
      </div>

      <!-- Bảng thông tin các sách -->
      <h2 style="color: black;">Danh Sách Sách</h2>
      <!-- Tìm kiếm theo ID hoặc tên sách -->
      <div class="mt-4 mb-3">
        <input type="text" id="searchInput" v-model="searchTerm" class="form-control" placeholder="Tìm kiếm theo ID hoặc tên sách..." />
      </div>
      <table class="table table-striped mt-3" id="bookTable">
        <thead style="background-color: rgb(0, 136, 255);">
          <tr>
            <th>MÃ SÁCH</th>
            <th>TÊN SÁCH</th>
            <th>ĐƠN GIÁ</th>
            <th>SỐ QUYỂN</th>
            <th>NĂM XUẤT BẢN</th>
            <th>MANXB</th>
            <th>TÁC GIẢ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in paginatedBooks" :key="book.MASACH">
            <td>{{ book.MASACH }}</td>
            <td>{{ book.TENSACH }}</td>
            <td>{{ book.DONGIA }}</td>
            <td>{{ book.SOQUYEN }}</td>
            <td>{{ book.NHAXUATBAN }}</td>
            <td>{{ book.MANXB }}</td>
            <td>{{ book.TACGIA }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Phân trang -->
      <nav aria-label="Page navigation">
        <ul class="pagination">
          <li class="page-item">
            <a class="page-link" href="#" @click.prevent="prevPage" :class="{ disabled: currentPage === 1 }">Previous</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="#" @click.prevent="nextPage" :class="{ disabled: currentPage * itemsPerPage >= filteredBooks.length }">Next</a>
          </li>
        </ul>
      </nav>

      <!-- Nút xuất Excel -->
      <button class="btn btn-success btn-custom" @click="exportToExcel">Xuất Excel</button>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';

export default {
  data() {
    return {
      bookData: {
        MASACH: '',
        TENSACH: '',
        DONGIA: '',
        SOQUYEN: 1,
        NHAXUATBAN: '',
        MANXB: '',
        TACGIA: '',
      },
      books: [],
      searchTerm: '',
      currentPage: 1,
      itemsPerPage: 6,
    };
  },
  computed: {
    filteredBooks() {
      return this.books.filter(book => {
        return (
          book.MASACH.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          book.TENSACH.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
    },
    paginatedBooks() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = this.currentPage * this.itemsPerPage;
      return this.filteredBooks.slice(start, end);
    },
  },
  async created() {
    await this.loadBooks();
  },
  methods: {
    async loadBooks() {
      try {
        const response = await fetch('http://localhost:3000/api/books');
        if (response.ok) {
          this.books = await response.json();
        } else {
          alert('Không thể lấy danh sách.');
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách:', error);
        alert('Có thể xảy ra lỗi khi tải danh sách.');
      }
    },
    async submitForm() {
      try {
        const response = await fetch('http://localhost:3000/api/books', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.bookData),
        });

        if (response.ok) {
          alert('Sách đã được tạo thành công!');
          this.bookData = {
            MASACH: '',
            TENSACH: '',
            DONGIA: '',
            SOQUYEN: 1,
            NHAXUATBAN: '',
            MANXB: '',
            TACGIA: '',
          };
          await this.loadBooks();
        } else {
          const errorData = await response.json();
          alert('Lỗi khi tạo sách: ' + errorData.message);
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu:', error);
        alert('Có thể xảy ra lỗi khi gửi yêu cầu.');
      }
    },
    exportToExcel() {
      const table = document.getElementById('bookTable');
      const wb = XLSX.utils.table_to_book(table, { sheet: 'Books' });
      XLSX.writeFile(wb, 'DanhSachSach.xlsx');
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage * this.itemsPerPage < this.filteredBooks.length) {
        this.currentPage++;
      }
    },
    ADD_NEW_STAFF() {
      this.$router.push('/ThemNhanVien');
    },
    ADD_NEW_BOOK() {
      this.$router.push('/ThemSach');
    },
    ADD_NEW_READER() {
      this.$router.push('/ThemDocGia');
    },
    ADD_NEW_PUBLISHER() {
      this.$router.push('/ThemNhaXuatBan');
    },
    goBack() {
      localStorage.removeItem('HoTenQTV');
      localStorage.removeItem('PasswordQTV');
      setTimeout(() => {
        this.$router.push('/AdminLogin');
      }, 100);
    },
  },
};
</script>

<style scoped>
    .pagecontent {
      font-family: "K2D", sans-serif;
      background-color: #e6f7ff;
      color: #333;
      height: 1400px;
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

    .btn-custom {
      margin-top: 20px;
      padding: 12px 25px;
      background-color: #007bff;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 50px;
      transition: background-color 0.3s ease, transform 0.2s ease;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    }

    .btn-custom:hover {
      background-color: #0056b3;
      transform: scale(1.05);
      box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
    }

    .table th,
    .table td {
      vertical-align: middle;
    }

    .card {
      border-radius: 15px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .card:hover {
      box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
      transform: translateY(-5px);
    }

    .table-striped tbody tr:nth-of-type(odd) {
      background-color: #f0f8ff;
    }

    .pagination .page-item .page-link {
      border-radius: 5px;
      padding: 8px 16px;
      color: #007bff;
      transition: background-color 0.3s ease;
    }

    .pagination .page-item .page-link:hover {
      background-color: #007bff;
      color: white;
    }

    .pagination .page-item.active .page-link {
      background-color: #007bff;
      color: white;
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
</style>