<template>
  <div class="pagecontent">
    <!-- Sidebar -->
    <div class="sidebar">
      <h3 class="text-white text-center">MENU</h3>
      <p @click="ADD_NEW_STAFF"><i class="fas fa-user"></i> THÊM NHÂN SỰ MỚI</p>
      <p @click="ADD_NEW_BOOK"><i class="fas fa-book"></i> THÊM SÁCH MỚI</p>
      <p @click="ADD_NEW_READER"><i class="fas fa-id-badge"></i> THÊM ĐỌC GIẢ MỚI</p>
      <p @click="ADD_NEW_PUBLISHER"><i class="fas fa-industry"></i> THÊM NHÀ XUẤT BẢN MỚI</p>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Nút trở lại -->
      <button class="btn btn-back" @click="goBack">Đăng Xuất</button>
      <div class="header">
        <h1>THÊM NHÀ XUẤT BẢN MỚI</h1>
      </div>

      <!-- Form thêm nhà xuất bản -->
      <div class="card p-4 mb-4">
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="MANXB" class="form-label">Mã Nhà Xuất Bản:</label>
            <input type="text" id="MANXB" v-model="publisher.MANXB" class="form-control" required />
          </div>

          <div class="mb-3">
            <label for="TENNXB" class="form-label">Tên Nhà Xuất Bản:</label>
            <input type="text" id="TENNXB" v-model="publisher.TENNXB" class="form-control" required />
          </div>

          <div class="mb-3">
            <label for="DIACHI" class="form-label">Địa Chỉ:</label>
            <input type="text" id="DIACHI" v-model="publisher.DIACHI" class="form-control" required />
          </div>

          <button type="submit" class="btn btn-primary btn-custom">Thêm Nhà Xuất Bản</button>
        </form>
      </div>

      <!-- Danh sách nhà xuất bản -->
      <h2 class="mt-5">Danh Sách Nhà Xuất Bản</h2>
      <div class="mt-4 mb-3">
        <input
          type="text"
          v-model="searchQuery"
          class="form-control"
          placeholder="Tìm kiếm theo Mã hoặc tên NXB..."
        />
      </div>

      <table class="table table-striped">
        <thead style="background-color: rgb(0, 136, 255);">
          <tr>
            <th>MÃ NHÀ XUẤT BẢN</th>
            <th>TÊN NHÀ XUẤT BẢN</th>
            <th>ĐỊA CHỈ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="publisher in paginatedPublishers" :key="publisher.MANXB">
            <td>{{ publisher.MANXB }}</td>
            <td>{{ publisher.TENNXB }}</td>
            <td>{{ publisher.DIACHI }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination justify-content-center">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="changePage(page)"
          :class="{ active: currentPage === page }"
          class="page-link"
        >
          {{ page }}
        </button>
      </div>

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
      publisher: {
        MANXB: '',
        TENNXB: '',
        DIACHI: '',
      },
      publishersData: [],
      searchQuery: '',
      currentPage: 1,
      publishersPerPage: 5,
    };
  },
  computed: {
    // Lọc danh sách nhà xuất bản dựa trên searchQuery
    filteredPublishers() {
      return this.publishersData.filter((publisher) => {
        return (
          publisher.MANXB.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          publisher.TENNXB.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    },
    // Tính tổng số trang
    totalPages() {
      return Math.ceil(this.filteredPublishers.length / this.publishersPerPage);
    },
    // Lấy danh sách nhà xuất bản cho trang hiện tại
    paginatedPublishers() {
      const start = (this.currentPage - 1) * this.publishersPerPage;
      return this.filteredPublishers.slice(start, start + this.publishersPerPage);
    },
  },
  methods: {
    // Tải danh sách nhà xuất bản từ API
    async loadPublisher() {
      try {
        const response = await fetch('http://localhost:3000/api/publisher');
        if (response.ok) {
          this.publishersData = await response.json();
        } else {
          alert('Không thể lấy danh sách.');
        }
      } catch (error) {
        console.error('Error loading publishers:', error);
      }
    },
    // Xử lý submit form
    async submitForm() {
      try {
        const response = await fetch('http://localhost:3000/api/publisher', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.publisher),
        });

        if (response.ok) {
          alert('Nhà xuất bản đã được tạo thành công!');
          this.loadPublisher(); // Tải lại danh sách
          this.publisher = { MANXB: '', TENNXB: '', DIACHI: '' }; // Reset form
        } else {
          const errorData = await response.json();
          alert('Lỗi khi tạo NXB: ' + errorData.message);
        }
      } catch (error) {
        console.error('Error creating publisher:', error);
      }
    },
    // Thay đổi trang
    changePage(page) {
      this.currentPage = page;
    },
    // Xuất Excel
    exportToExcel() {
      const ws = XLSX.utils.json_to_sheet(this.publishersData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Publishers');
      XLSX.writeFile(wb, 'publishers.xlsx');
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
    // Đăng xuất
    goBack() {
      localStorage.removeItem('HoTenQTV');
      localStorage.removeItem('PasswordQTV');
      setTimeout(() => {
        window.location.href = '/AdminLogin';
      }, 100);
    },
  },
  mounted() {
    this.loadPublisher(); // Tải danh sách khi component được mount
  },
};
</script>

<style scoped>
    .pagecontent {
      font-family: "K2D", sans-serif;
      background-color: #e6f7ff;
      color: #333;
      height: 1150px;
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