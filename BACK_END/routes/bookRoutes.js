const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookControllers');  // Đảm bảo đường dẫn đúng

// Route POST để thêm sách mới
router.post('/', bookController.createBook);
// Route GET để lấy tất cả các loại sách có trong hệ thống
router.get('/', bookController.getAllBooks);
// Kiểm tra mã Sách
router.get('/:MASACH', bookController.checkBookCode);
// API để lấy thông tin chi tiết sách theo MASACH
router.get('/book/:MASACH', bookController.getBookID);
// Route để cập nhật số lượng sách
router.post('/update-stock/:MASACH', bookController.updateBookStock);
// API cập nhật số lượng sách theo ID nhập từ nhân viên
router.put('/updateBooks/:id',bookController.enterQuantity)

module.exports = router;
