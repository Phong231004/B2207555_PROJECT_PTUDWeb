// controllers/readerController.js
const bcrypt = require('bcryptjs');
const Reader = require('../models/Reader');
// Thêm đọc giả mới
module.exports.createReader = async (req, res) => {
    const { 
        MADOCGIA,
        HOLOT,
        TEN,
        PASSWORD,
        NGAYSINH,
        PHAI,
        DIACHI,
        DIENTHOAI 
    } = req.body;

  // Kiểm tra dữ liệu yêu cầu
  if (!MADOCGIA || !HOLOT || !TEN || !DIENTHOAI) {
    return res.status(400).json({ message: 'Mã đọc giả, họ và tên và số điện thoại là bắt buộc.' });
  }

  try {
    // Kiểm tra xem có đọc giả nào tồn tại với Mã Đọc Giả này không
    const existingReader = await Reader.findOne({ MADOCGIA });
    if (existingReader) {
      return res.status(400).json({ message: 'Đọc giả đã tồn tại trong cơ sở dữ liệu.' });
    }
    const generatePassword = () => {
            const chars = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789!@#$%^&*';
            return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        };
    const rawPassword = generatePassword();
    // Tạo đọc giả mới
    const newReader = new Reader({
        MADOCGIA,
        HOLOT,
        TEN,
        PASSWORD: rawPassword,
        NGAYSINH,
        PHAI,
        DIACHI,
        DIENTHOAI,
    });

    await newReader.save();
    res.status(201).json({ 
            message: 'Đọc giả đã được tạo thành công!',
            password: rawPassword  // Gửi mật khẩu ngẫu nhiên cho người dùng
        });
  } catch (err) {
    console.error('Lỗi khi lưu đọc giả:', err);
    res.status(500).json({ message: err.message });
  }
};

// Lấy tất cả đọc giả
module.exports.getAllReader = async (req, res) => {
  try {
    const readerList = await Reader.find();
    if (!readerList || readerList.length === 0) {
      return res.status(404).json({ message: 'Không có đọc giả nào trong cơ sở dữ liệu.' });
    }
    res.status(200).json(readerList);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách:', err.message);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách đọc giả.' });
  }
};

// Kiểm tra mã đọc giả
module.exports.checkReaderCode = async (req, res) => {
  try {
    const reader = await Reader.findOne({ MADOCGIA: req.params.MADOCGIA });
    if (!reader) {
      return res.status(404).json({ message: 'Đọc giả không tồn tại!' });
    }
    res.json(reader);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tìm kiếm đọc giả!' });
  }
};
// Kiểm tra đăng nhập
module.exports.checkReaderLogin = async (req, res) => {
  const { HOLOT, PASSWORD } = req.body; // Tên đầy đủ người dùng nhập vào

  try {
    // Tách tên đầy đủ thành họ lót và tên (dựa trên khoảng trắng)
    const fullName = HOLOT.trim(); // Đảm bảo không có khoảng trắng thừa
    const nameParts = fullName.split(' '); // Tách thành mảng các từ

    // Kiểm tra nếu người dùng nhập ít nhất hai phần (họ lót và tên)
    if (nameParts.length < 2) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ họ và tên!' });
    }

    // Tách họ lót và tên:
    const hoLot = nameParts.slice(0, -1).join(' '); // Họ lót, bao gồm tất cả các từ trước tên cuối cùng
    const ten = nameParts[nameParts.length - 1]; // Tên, là phần cuối cùng trong mảng

    // Tìm kiếm người dùng trong CSDL theo họ lót và tên
    const reader = await Reader.findOne({
      $and: [
        { HOLOT: hoLot }, // Họ lót
        { TEN: ten } // Tên
      ]
    });

    if (!reader) {
      return res.status(400).json({ message: 'Họ tên không đúng!' });
    }

    console.log('Mật khẩu người dùng nhập:', PASSWORD);

    // Kiểm tra mật khẩu đã mã hóa trong CSDL
    // const isMatch = await bcrypt.compare(PASSWORD, reader.PASSWORD); // So sánh mật khẩu đã mã hóa
    const isMatch = await Reader.findOne({ PASSWORD: PASSWORD });
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu không đúng!' });
    }

    // Đăng nhập thành công
    return res.status(200).json({ message: 'Đăng nhập thành công', reader });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi hệ thống!' });
  }
};

exports.getReader = async (req, res) => {
  try {
    const { name } = req.params;
    console.log('Tìm đọc giả có tên:', name); // Debug

    if (!name) {
      return res.status(400).json({ message: 'Vui lòng nhập tên đọc giả' });
    }

    const readers = await Reader.find({ TEN: { $regex: new RegExp(`^${name}$`, 'i') } });
    
    console.log('📌 Kết quả tìm kiếm:', readers); // Debug

    if (readers.length === 0) {
      return res.status(404).json({ message: 'Đọc giả không tồn tại!' });
    }

    res.json(readers);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
