const express = require('express');
const Reader = require('../models/Reader');
const Transactions = require('../models/Transaction');
const Book = require('../models/Book');
const Publisher = require('../models/Publisher');
const Staff = require('../models/Staff');

const router = express.Router();

router.get('/borrower-details', async (req, res) => {
  const { MADOCGIA } = req.query;

  try {
    if (!MADOCGIA) {
      return res.status(400).json({ message: 'Thiếu mã đọc giả' });
    }

    const transactions = await Transactions.find({ MADOCGIA });
    console.log('Giao dịch:', transactions); // Debug thay vì alert
    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu.' });
    }
    // Lấy thông tin sách, nhân viên và nhà xuất bản cho từng giao dịch
    const detailedInfo = await Promise.all(transactions.map(async (transaction) => {
      const book = await Book.findOne({ MASACH: transaction.MASACH });
      const publisher = book ? await Publisher.findOne({ MANXB: book.MANXB }) : null;
      const staff = await Staff.findOne({ MSNV: transaction.MSNV });
      const reader = await Reader.findOne({ MADOCGIA: transaction.MADOCGIA })

      return {
        MADOCGIA: reader.MADOCGIA,
        HOTEN: `${reader.HOLOT} ${reader.TEN}`,
        NGAYSINH: reader.NGAYSINH,
        PHAI: reader.PHAI,
        DIACHI: reader.DIACHI,
        DIENTHOAI: reader.DIENTHOAI,
        MASACH: book ? book.MASACH : 'Không có thông tin',
        TENSACH: book ? book.TENSACH : 'Không có thông tin',
        DONGIA: book ? book.DONGIA : 'Không có thông tin',
        SOQUYEN: book ? book.SOQUYEN : 'Không có thông tin',
        NAMXUATBAN: book ? book.NAMXUATBAN : 'Không có thông tin',
        MANXB: book ? book.MANXB : 'Không có thông tin',
        TENNXB: publisher ? publisher.TENNXB : 'Không có thông tin',
        TACGIA: book ? book.TACGIA : 'Không có thông tin',
        MSNV: staff ? staff.MSNV : 'Không có thông tin',
        HOTENNV: staff ? staff.HoTenNV : 'Không có thông tin',
        CHUCVU: staff ? staff.ChucVu : 'Không có thông tin',
        DIACHI_NV: staff ? staff.DiaChi : 'Không có thông tin',
        SODIENTHOAI: staff ? staff.SoDienThoai : 'Không có thông tin',
        NGAYMUON: transaction.NGAYMUON,
        NGAYTRA: transaction.NGAYTRA
      };
    }));

    res.json(detailedInfo);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy thông tin.' });
  }
});

// API để mượn sách
router.post('/borrow', async (req, res) => {
  const { MASACH } = req.body;  // Lấy MASACH từ body request

  try {
    // Tìm các sách theo MASACH
    const books = await Book.find({ MASACH: { $in: MASACH } });

    // Kiểm tra sách có đủ số lượng hay không
    for (let book of books) {
      if (book.SOQUYEN <= 0) {
        return res.status(400).json({ message: `Sách ${book.TENSACH} không còn đủ số lượng để mượn` });
      }
    }
    // Cập nhật số lượng sách trong kho
    await Promise.all(
      books.map(book => {
        return Book.updateOne(
          { MASACH: book.MASACH },
          { $inc: { SOQUYEN: -1 } } // Giảm số lượng sách đi 1
        );
      })
    );

    // Trả kết quả
    res.status(200).json({ message: 'Mượn sách thành công' });

  } catch (error) {
    console.error('Lỗi khi mượn sách:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi mượn sách.' });
  }
});
module.exports = router;
