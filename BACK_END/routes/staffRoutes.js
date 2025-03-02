const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffControllers');  // Đảm bảo đường dẫn đúng

// Route POST để thêm nhân viên mới
router.post('/', staffController.createStaff);
// Route GET để lấy tất cả các nhân viên có trong hệ thống
router.get('/', staffController.getAllStaff);
// Kiểm tra mã Nhân Viên
router.get('/:MSNV', staffController.checkStaffCode);
// Kiểm tra đăng nhập
router.post('/login', staffController.checkStaffLogin);  // Sửa lại để là POST
// Kiểm tra đăng nhập QTV
router.post('/AdministratorLogin', staffController.checkAdministratorLogin);

module.exports = router;
