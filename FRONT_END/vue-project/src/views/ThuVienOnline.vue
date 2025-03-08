<template>
  <div>
    <div class="menu-dropdown" @click="goToInfo">
      <p>Thông Tin</p>
    </div>

    <header class="bg-primary text-white text-center py-4">
      <h1 style="font-family: K2D;">THƯ VIỆN SÁCH TRI THỨC ONLINE</h1>
    </header>

    <button class="btn btn-back" @click="goBack">Trở lại</button>

    <section class="container my-5">
      <div class="row g-4">
        <div v-for="book in paginatedBooks" :key="book.MASACH" class="col-md-4">
          <div class="card book-card">
            <div class="card-body">
              <h5 style="color: black;" class="card-title">{{ book.TENSACH }}</h5>
              <p class="text-muted"><strong>Tác giả:</strong> {{ book.TACGIA }}</p>
              <p class="text-muted"><strong>Giá:</strong> {{ book.DONGIA }} VNĐ</p>
              <p class="text-muted"><strong>NXB:</strong> {{ book.NHAXUATBAN }}</p>
              <p :class="{'book-quantity-zero': book.SOQUYEN == 0}">
                {{ book.SOQUYEN == 0 ? 'Hết hàng' : `Số lượng: ${book.SOQUYEN}` }}
              </p>
              <div class="form-check">
                <input 
                  type="checkbox" 
                  class="form-check-input" 
                  :disabled="book.SOQUYEN == 0" 
                  :class="{'checkbox-warning': book.SOQUYEN == 0}"
                  :value="book.MASACH"
                  v-model="selectedBooks"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center mt-4">
        <button v-for="page in totalPages" :key="page" class="btn btn-outline-primary mx-1" @click="setPage(page)">
          {{ page }}
        </button>
      </div>
    </section>

    <section class="container my-5">
      <h2 class="text-center mb-4">Đăng Ký Mượn Sách</h2>
      <div class="alert alert-info text-center" role="alert">
        Lưu ý: Bạn chỉ có thể mượn tối đa 1 quyển cho mỗi loại sách.
      </div>
      <form @submit.prevent="borrowBooks">
        <button type="submit" class="btn btn-primary w-100">Mượn Sách</button>
      </form>
      <div class="mt-3 text-center">{{ borrowMessage }}</div>
    </section>

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
      books: [],
      selectedBooks: [],
      booksPerPage: 6,
      currentPage: 1,
      borrowMessage: '',
      showMenu: false,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.books.length / this.booksPerPage);
    },
    paginatedBooks() {
      const start = (this.currentPage - 1) * this.booksPerPage;
      return this.books.slice(start, start + this.booksPerPage);
    }
  },
  methods: {
    async fetchBooks() {
      try {
        const response = await fetch('http://localhost:3000/api/books');
        if (!response.ok) throw new Error("Lỗi tải sách!");
        this.books = await response.json();
      } catch (error) {
        console.error('Lỗi khi tải sách:', error);
        this.books = []; // Đảm bảo không bị lỗi khi render
      }
    },
    async borrowBooks() {
  if (!this.selectedBooks.length) {
    alert("Vui lòng chọn ít nhất một cuốn sách.");
    return;
  }

  let HoTenDG = localStorage.getItem("HoTenDG") || "Độc giả không xác định";
  let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];

  this.selectedBooks.forEach((bookId) => {
    borrowedBooks.push(bookId);  // Chỉ số chẵn: MASACH
    borrowedBooks.push(HoTenDG); // Chỉ số lẻ: HoTenDG
  });

  localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));

  console.log("Dữ liệu lưu trong localStorage:", borrowedBooks);

  try {
    const response = await fetch("http://localhost:3000/api/borrow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ MASACH: this.selectedBooks })
    });

    const data = await response.json();
    
    if (response.ok) {
      this.borrowMessage = "Đăng ký mượn sách thành công!";
    } else {
      this.borrowMessage = "Lỗi: " + data.message;
    }
  } catch (err) {
    console.error("Lỗi kết nối:", err);
    this.borrowMessage = "Không thể kết nối đến server.";
  }
  
  setTimeout(() => {
    location.reload();
  }, 1000);
},
    setPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    goBack() {
      localStorage.removeItem('HoTenDG');
      localStorage.removeItem('PasswordDG');
      setTimeout(() => {
        window.location.href = '/ReaderLogin';
      }, 100);
    },
    goChat() {
      setTimeout(() => {
        window.location.href = '/ChatBoxAI';
      }, 100);
    },
    goToInfo() {
      window.location.href = '/DocGiaXemDanhSachDaMuon'; 
    }
  },
  mounted() {
    this.fetchBooks();
  }
};
</script>

<style scoped>
.btn-back:hover {
  background-color: #ff4500;
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.book-card {
  transition: transform 0.2s ease, background-color 0.3s ease;
}

.book-card:hover {
  transform: scale(1.05);
  background-color: #f0f8ff;
}

.book-quantity-zero {
  color: #d9534f;
  font-weight: bold;
  background-color: #f8d7da;
  border-radius: 5px;
  padding: 4px 8px;
}

.checkbox-warning {
  border: 2px solid #d9534f;
  background-color: #f8d7da;
  transition: background-color 0.3s ease, border 0.3s ease;
}

.checkbox-warning:hover {
  background-color: #f5c6cb;
}

.form-check-input {
  transform: scale(1.5);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.form-check-input:hover {
  transform: scale(1.7);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.form-check-input:checked {
  background-color: #007bff;
  border-color: #007bff;
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
.menu-dropdown {
  position: absolute;
  top: 20px;
  left: 20px;
  background: linear-gradient(135deg, #ff9a9e, #fad0c4);
  color: white;
  font-weight: bold;
  font-size: 18px;
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.menu-dropdown:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.3);
}

.menu-dropdown p {
  margin: 0;
  text-align: center;
  font-family: 'K2D', sans-serif;
  letter-spacing: 1px;
}


</style>
