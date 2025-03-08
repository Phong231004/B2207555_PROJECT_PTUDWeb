<template>
  <div class="pagecontent">
    <!-- Sidebar -->
    <div class="sidebar">
      <h3 class="text-white text-center">MENU</h3>
      <p @click="navigate('/ThemNhanVien')"><i class="fas fa-user"></i> THÊM NHÂN SỰ MỚI</p>
      <p @click="navigate('/ThemSach')"><i class="fas fa-book"></i> THÊM SÁCH MỚI</p>
      <p @click="navigate('/ThemDocGia')"><i class="fas fa-id-badge"></i> THÊM ĐỌC GIẢ MỚI</p>
      <p @click="navigate('/ThemNhaXuatBan')"><i class="fas fa-industry"></i> THÊM NHÀ XUẤT BẢN MỚI</p>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Logout Button -->
      <button class="btn btn-back" @click="logout">Đăng Xuất</button>

      <!-- Header -->
      <div class="header">
        <h1>THÊM ĐỌC GIẢ MỚI</h1>
      </div>

      <!-- Add Reader Form -->
      <div class="card p-4 mb-4">
        <form @submit.prevent="addReader">
          <div v-for="field in readerFields" :key="field.id" class="mb-3">
            <label :for="field.id" class="form-label">{{ field.label }}:</label>
            <input
              v-model="reader[field.id]"
              :type="field.type"
              :id="field.id"
              class="form-control"
              :required="field.required"
            />
          </div>
          <button type="submit" class="btn btn-primary btn-custom">Thêm Đọc Giả</button>
        </form>
      </div>

      <!-- Reader List -->
      <h2 class="mt-5">Danh Sách Đọc Giả</h2>
      <input
        type="text"
        v-model="searchQuery"
        class="form-control"
        placeholder="Tìm kiếm theo ID hoặc tên đọc giả..."
      />

      <!-- Table -->
      <table class="table table-striped">
        <thead>
          <tr>
            <th>MÃ ĐỌC GIẢ</th>
            <th>HỌ VÀ TÊN</th>
            <th>NGÀY SINH</th>
            <th>GIỚI TÍNH</th>
            <th>ĐỊA CHỈ</th>
            <th>SỐ ĐIỆN THOẠI</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reader in paginatedReaders" :key="reader.MADOCGIA">
            <td>{{ reader.MADOCGIA }}</td>
            <td>{{ reader.HOLOT + ' ' + reader.TEN }}</td>
            <td>{{ reader.NGAYSINH }}</td>
            <td>{{ reader.PHAI }}</td>
            <td>{{ reader.DIACHI }}</td>
            <td>{{ reader.DIENTHOAI }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
          </li>
          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
          >
            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
          </li>
        </ul>
      </nav>

      <!-- Export to Excel -->
      <button class="btn btn-success btn-custom" @click="exportToExcel">Xuất Excel</button>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';

export default {
  data() {
    return {
      reader: {
        MADOCGIA: '',
        HOLOT: '',
        TEN: '',
        NGAYSINH: '',
        PHAI: '',
        DIACHI: '',
        DIENTHOAI: '',
      },
      readerFields: [
        { id: 'MADOCGIA', label: 'Mã Đọc Giả', type: 'text', required: true },
        { id: 'HOLOT', label: 'Họ Đọc Giả', type: 'text', required: true },
        { id: 'TEN', label: 'Tên Đọc Giả', type: 'text', required: true },
        { id: 'NGAYSINH', label: 'Ngày Sinh', type: 'date', required: true },
        { id: 'PHAI', label: 'Giới tính', type: 'text', required: true },
        { id: 'DIACHI', label: 'Địa Chỉ', type: 'text', required: true },
        { id: 'DIENTHOAI', label: 'Số điện thoại', type: 'text', required: true },
      ],
      readers: [],
      searchQuery: '',
      itemsPerPage: 5,
      currentPage: 1,
    };
  },
  computed: {
    filteredReaders() {
      return this.readers.filter(
        (reader) =>
          reader.MADOCGIA.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          reader.TEN.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    totalPages() {
      return Math.ceil(this.filteredReaders.length / this.itemsPerPage);
    },
    paginatedReaders() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredReaders.slice(start, start + this.itemsPerPage);
    },
  },
  methods: {
    async loadReaders() {
      try {
        const response = await fetch('http://localhost:3000/api/reader');
        if (response.ok) {
          this.readers = await response.json();
        } else {
          alert('Không thể lấy danh sách đọc giả. Vui lòng thử lại sau.');
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách đọc giả:', error);
        alert('Đã xảy ra lỗi khi tải danh sách đọc giả.');
      }
    },
    async addReader() {
      if (!this.validatePhoneNumber(this.reader.DIENTHOAI)) {
        alert('Số điện thoại không hợp lệ.');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/reader', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.reader),
        });

        if (response.ok) {
          alert('Đọc giả đã được tạo thành công!');
          this.reader = {
            MADOCGIA: '',
            HOLOT: '',
            TEN: '',
            NGAYSINH: '',
            PHAI: '',
            DIACHI: '',
            DIENTHOAI: '',
          };
          this.loadReaders();
        } else {
          const errorData = await response.json();
          alert('Lỗi khi tạo đọc giả: ' + errorData.message);
        }
      } catch (error) {
        console.error('Lỗi khi tạo đọc giả:', error);
      }
    },
    validatePhoneNumber(phone) {
      const regex = /^\d{10}$/; // Example: 10-digit phone number
      return regex.test(phone);
    },
    exportToExcel() {
      const ws = XLSX.utils.json_to_sheet(this.readers, {
        header: ['MADOCGIA', 'HOLOT', 'TEN', 'NGAYSINH', 'PHAI', 'DIACHI', 'DIENTHOAI'],
      });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Readers');
      XLSX.writeFile(wb, 'readers.xlsx');
    },
    navigate(path) {
      this.$router.push(path);
    },
    logout() {
      localStorage.removeItem('HoTenQTV');
      localStorage.removeItem('PasswordQTV');
      setTimeout(() => (window.location.href = '/AdminLogin'), 100);
    },
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
  mounted() {
    this.loadReaders();
  },
};
</script>

<style scoped>
.pagecontent {
      font-family: "K2D", sans-serif;
      background-color: #e6f7ff;
      color: #333;
      height: 1600px;
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