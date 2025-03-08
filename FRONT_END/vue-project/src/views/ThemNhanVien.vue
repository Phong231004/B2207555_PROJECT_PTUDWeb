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
        <h1>THÊM NHÂN SỰ MỚI</h1>
      </div>

      <!-- Form Thêm Nhân Sự -->
      <div class="card p-4 mb-4">
        <form id="staffForm" @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="Ma_NV" class="form-label">Mã Nhân Sự:</label>
            <input type="text" id="Ma_NV" v-model="staffData.MSNV" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="HoTenNV" class="form-label">Họ Tên Nhân Sự:</label>
            <input type="text" id="HoTenNV" v-model="staffData.HoTenNV" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="Password" class="form-label">Password:</label>
            <input type="password" id="Password" v-model="staffData.Password" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="ChucVu" class="form-label">Chức Vụ:</label>
            <input type="text" id="ChucVu" v-model="staffData.ChucVu" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="DiaChi" class="form-label">Địa Chỉ:</label>
            <input type="text" id="DiaChi" v-model="staffData.DiaChi" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="SoDienThoai" class="form-label">Số Điện Thoại:</label>
            <input type="text" id="SoDienThoai" v-model="staffData.SoDienThoai" class="form-control" required>
          </div>

          <button type="submit" class="btn btn-primary btn-custom">Thêm Nhân Sự</button>
        </form>
      </div>

      <!-- Bảng thông tin nhân sự -->
      <h2 class="mt-5">Danh Sách Nhân Sự</h2>
      <!-- Tìm kiếm theo ID hoặc tên nhân sự -->
      <div class="mt-4 mb-3">
        <input type="text" id="searchInput" v-model="searchTerm" class="form-control" placeholder="Tìm kiếm theo ID hoặc tên nhân sự..." />
      </div>
      <table class="table table-striped">
        <thead style="background-color: rgb(0, 136, 255);">
          <tr>
            <th>MÃ NHÂN SỰ</th>
            <th>HỌ VÀ TÊN</th>
            <th>CHỨC VỤ</th>
            <th>ĐỊA CHỈ</th>
            <th>SỐ ĐIỆN THOẠI</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="staff in paginatedStaff" :key="staff.MSNV">
            <td>{{ staff.MSNV }}</td>
            <td>{{ staff.HoTenNV }}</td>
            <td>{{ staff.ChucVu }}</td>
            <td>{{ staff.DiaChi }}</td>
            <td>{{ staff.SoDienThoai }}</td>
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
            <a class="page-link" href="#" @click.prevent="nextPage" :class="{ disabled: currentPage * itemsPerPage >= filteredStaff.length }">Next</a>
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
      staffData: {
        MSNV: '',
        HoTenNV: '',
        Password: '',
        ChucVu: '',
        DiaChi: '',
        SoDienThoai: '',
      },
      staffList: [],
      searchTerm: '',
      currentPage: 1,
      itemsPerPage: 5,
    };
  },
  computed: {
    filteredStaff() {
      return this.staffList.filter(staff => {
        return (
          staff.MSNV.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          staff.HoTenNV.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
    },
    paginatedStaff() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = this.currentPage * this.itemsPerPage;
      return this.filteredStaff.slice(start, end);
    },
  },
  async created() {
    await this.loadStaff();
  },
  methods: {
    async loadStaff() {
      try {
        const response = await fetch('http://localhost:3000/api/staff');
        if (response.ok) {
          this.staffList = await response.json();
        } else {
          alert('Không thể lấy danh sách nhân sự.');
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách nhân sự:', error);
        alert('Có thể xảy ra lỗi khi tải danh sách nhân sự.');
      }
    },
    async submitForm() {
      try {
        const response = await fetch('http://localhost:3000/api/staff', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.staffData),
        });

        if (response.ok) {
          alert('Nhân sự đã được thêm thành công!');
          this.staffData = {
            MSNV: '',
            HoTenNV: '',
            Password: '',
            ChucVu: '',
            DiaChi: '',
            SoDienThoai: '',
          };
          await this.loadStaff();
        } else {
          const errorData = await response.json();
          alert('Lỗi khi thêm nhân sự: ' + errorData.message);
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu:', error);
        alert('Có thể xảy ra lỗi khi gửi yêu cầu.');
      }
    },
    exportToExcel() {
      const table = document.querySelector('.table');
      const wb = XLSX.utils.table_to_book(table, { sheet: 'Staff' });
      XLSX.writeFile(wb, 'DanhSachNhanSu.xlsx');
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage * this.itemsPerPage < this.filteredStaff.length) {
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
    }
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