const express = require('express')
const router = express.Router();
const connectDB = require('../../db');
const { PORT, BASE_URL } = require('../../link');

router.get('/getListCategory', async (req, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.execute('SELECT id, name FROM categories');
    await db.end();
    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách category:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

module.exports = router;