const Staff = require('../models/Staff');

// Thêm nhân viên mới
module.exports.createStaff = async (req, res) => {
  const { MSNV, HoTenNV, Password, ChucVu, DiaChi, SoDienThoai } = req.body;

  // Kiểm tra dữ liệu yêu cầu
  if (!HoTenNV || !Password || !SoDienThoai) {
    return res.status(400).json({ message: 'HoTenNV, Password và SoDienThoai là bắt buộc.' });
  }

  try {
    // Kiểm tra xem có nhân viên nào tồn tại với MSNV này không
    const existingStaff = await Staff.findOne({ MSNV });
    if (existingStaff) {
      return res.status(400).json({ message: 'Nhân viên đã tồn tại trong cơ sở dữ liệu.' });
    }

    // Tạo nhân viên mới
    const newStaff = new Staff({
      MSNV,
      HoTenNV,
      Password,
      ChucVu,
      DiaChi,
      SoDienThoai,
    });

    // Lưu nhân viên vào MongoDB
    await newStaff.save();

    // Trả về phản hồi thành công
    res.status(201).send('Nhân viên đã được tạo thành công!');
  } catch (err) {
    console.error('Lỗi khi lưu nhân viên:', err);
    res.status(500).json({ message: 'Lỗi hệ thống: ' + err.message });
  }
};

// Lấy tất cả nhân viên
module.exports.getAllStaff = async (req, res) => {
  try {
    const staffList = await Staff.find();
    if (!staffList || staffList.length === 0) {
      return res.status(404).json({ message: 'Không có nhân viên nào trong cơ sở dữ liệu.' });
    }
    res.status(200).json(staffList);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách:', err.message);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách nhân viên.', error: err.message });
  }
};

// Tìm nhân viên theo mã
module.exports.findOne = async (query) => {
  return await Staff.findOne(query);
};

//Kiểm tra mã nhân viên
module.exports.checkStaffCode = async (req, res) => {  // Đảm bảo đúng tên tham số: MSNV thay vì MANV
  try {
    const staff = await Staff.findOne({ MSNV: req.params.MSNV });
    if (!staff) {
      return res.status(404).json({ message: 'Nhân viên không tồn tại!' });
    }
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tìm kiếm nhân viên!' });
  }
}

// Kiểm tra đăng nhập
module.exports.checkStaffLogin = async (req, res) => {
  const { HoTenNV, Password } = req.body; // Tên đầy đủ người dùng nhập vào

  try {

    // Tìm kiếm nhân viên trong CSDL theo họ tên
    const staff = await Staff.findOne({HoTenNV: HoTenNV});

    if (!staff) {
      return res.status(400).json({ message: 'Họ tên không đúng!' });
    }

    console.log('Mật khẩu người dùng nhập:', Password);
    // Tìm kiếm mật khẩu
    const isMatch = await Staff.findOne({ Password: Password });
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu không đúng!' });
    }

    // Đăng nhập thành công
    return res.status(200).json({ message: 'Đăng nhập thành công', staff });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi hệ thống!' });
  }
};

// Kiểm tra đăng nhập Quản trị viên
module.exports.checkAdministratorLogin = async (req, res) => {
  const { HOTEN, PASSWORD } = req.body; // Tên đầy đủ và mật khẩu người dùng nhập vào
  try {
    // Danh sách các tên hợp lệ
    const validFullNames = ['Lê Quốc Bảo', 'Lê Thị Thu Hà'];
    const validPasswords = ['B@o$Qu@ng123', 'ThuH@_#2024'];

    // Kiểm tra họ tên có trong danh sách không
    if (!validFullNames.includes(HOTEN)) {
        return res.status(400).json({ message: 'Họ tên không đúng!' });
    }

    // Kiểm tra mật khẩu có trong danh sách không
    if (!validPasswords.includes(PASSWORD)) {
        return res.status(400).json({ message: 'Mật khẩu không đúng!' });
    }

    // Nếu hợp lệ, cho phép đăng nhập
    return res.status(200).json({ message: 'Đăng nhập thành công!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi server' });
}
};
