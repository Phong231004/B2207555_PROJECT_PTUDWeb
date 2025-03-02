const Book = require('../models/Book');

// Thêm sách mới
module.exports.createBook = async (req, res) => {
  const { MASACH, TENSACH, DONGIA, SOQUYEN, NHAXUATBAN, MANXB, TACGIA } = req.body;

  // Nếu SOQUYEN không có giá trị hoặc không phải là một số hợp lệ, gán mặc định là 1
  const quantity = SOQUYEN && !isNaN(SOQUYEN) && SOQUYEN > 0 ? SOQUYEN : 1;

  try {
    // Kiểm tra xem có sách nào đã tồn tại với MASACH này không
    const existingBook = await Book.findOne({ MASACH });
    if (existingBook) {
      return res.status(400).json({ message: 'Mã sách đã tồn tại trong cơ sở dữ liệu.' });
    }

    // Tạo sách mới nếu MASACH không trùng
    const newBook = new Book({
      MASACH, TENSACH, DONGIA, SOQUYEN: quantity, NHAXUATBAN, MANXB, TACGIA
    });

    // Lưu sách vào MongoDB trong bộ sưu tập 'SACH'
    await newBook.save();

    // Trả về phản hồi thành công
    res.status(201).send('Sách đã được tạo thành công!');
  } catch (err) {
    console.error('Lỗi khi lưu sách:', err);
    res.status(500).json({ message: err.message });
  }
};

// Lấy tất cả sách
module.exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    if (!books || books.length === 0) {
      return res.status(404).json({ message: 'Không có sách nào trong cơ sở dữ liệu.' });
    }
    res.status(200).json(books);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách:', err.message);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy sách.', error: err.message });
  }
};
// Tìm sách
module.exports.findOne = async (query) => {
  return await Book.findOne(query);
}
// Kiểm tra mã sách
module.exports.checkBookCode = async (req, res) => {
  try {
    const book = await Book.findOne({ MASACH: req.params.MASACH });
    if (!book) {
      return res.status(404).json({ message: 'Sách không tồn tại!' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tìm kiếm sách!' });
  }
}
// API để lấy thông tin sách theo MASACH
module.exports.getBookID = async (req, res) => {
  const { MASACH } = req.params;  // Lấy MASACH từ params

  try {
    // console.log(`Tìm kiếm sách với MASACH: ${MASACH}`); // Debugging log
    const book = await Book.findOne({ MASACH });

    if (!book) {
      return res.status(404).json({ message: `Không tìm thấy sách với mã ${MASACH}` });
    }

    // Trả về thông tin sách
    res.json(book);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin sách:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy thông tin sách.' });
  }
};
//Cập nhật số lượng sách khi từ chối/trả
module.exports.updateBookStock = async (req, res) => {
  const { MASACH } = req.params;  // Lấy MASACH từ URL

  try {
    // Tìm sách trong cơ sở dữ liệu theo MASACH (không phải _id)
    const book = await Book.findOne({ MASACH });

    if (!book) {
      return res.status(404).json({ message: 'Sách không tìm thấy' });
    }

    // Kiểm tra số lượng sách trước khi cập nhật
    console.log(`Số lượng sách trước khi cập nhật: ${book.SOQUYEN}`);

    // Tạo một bản ghi mới với số lượng đã được cập nhật
    const newBook = new Book({
      MASACH: book.MASACH,
      TENSACH: book.TENSACH,
      DONGIA: book.DONGIA,
      SOQUYEN: book.SOQUYEN + 1, // Tăng số lượng sách lên 1
      NHAXUATBAN: book.NHAXUATBAN,
      MANXB: book.MANXB,
      TACGIA: book.TACGIA
    });

    // Xóa bản ghi cũ
    await Book.deleteOne({ MASACH });

    // Lưu bản ghi mới vào cơ sở dữ liệu
    await newBook.save();

    console.log(`Số lượng sách sau khi cập nhật: ${newBook.SOQUYEN}`);

    // Trả về phản hồi thành công
    return res.json({ message: 'Đã tạo bản ghi mới với số lượng sách đã cập nhật', book: newBook });
  } catch (error) {
    console.error('Lỗi khi cập nhật số lượng sách:', error); // In ra lỗi chi tiết
    res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật số lượng sách.', error: error.message });
  }
};

// API cập nhật số lượng sách theo ID nhập từ nhân viên
module.exports.enterQuantity = async (req, res) => {
  try {
    const { additionalQuantity } = req.body;
    const book = await Book.findOne({ MASACH: req.params.id });

    if (!book) return res.status(404).json({ message: 'Sách không tồn tại' });

    const newQuantity = book.SOQUYEN + additionalQuantity;

    // Nếu số lượng sau khi cập nhật < 0 thì báo lỗi
    if (newQuantity < 0) {
      return res.status(400).json({ message: 'Số lượng sách không thể là số âm!' });
    }

    book.SOQUYEN = newQuantity;
    await book.save();

    res.json({ message: 'Cập nhật thành công', updatedBook: book });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};
