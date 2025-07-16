// routes/about.js
const express = require('express');
const router = express.Router();
const connectDB = require('../db'); 

router.post('/save', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ success: false, message: "Thiếu nội dung" });
  }

  try {
    const db = await connectDB();
    const [rows] = await db.execute("SELECT * FROM about LIMIT 1");

    if (rows.length > 0) {
      await db.execute("UPDATE about SET content = ?, updated_at = NOW() WHERE id = ?", [content, rows[0].id]);
    } else {
      await db.execute("INSERT INTO about (content) VALUES (?)", [content]);
    }

    await db.end();
    return res.json({ success: true, message: "Lưu thành công" });
  } catch (err) {
    console.error("Lỗi khi lưu giới thiệu:", err);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
});

// GET /about - Lấy nội dung giới thiệu
router.get('/get', async (req, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.execute("SELECT * FROM about ORDER BY id DESC LIMIT 1");
    await db.end();

    if (rows.length === 0) {
      return res.json({ success: false, message: "Chưa có nội dung" });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("Lỗi khi lấy giới thiệu:", err);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
});

module.exports = router;
