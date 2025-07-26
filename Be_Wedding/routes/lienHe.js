const express = require('express');
const router = express.Router();
const connectDB = require('../db');

router.post("/send", async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }

    const db = await connectDB();

    const sql = `INSERT INTO lien_he (ten, phone, messenger) VALUES (?, ?, ?)`;
    const [result] = await db.execute(sql, [name, phone, message]);

    await db.end();

    console.log("Dữ liệu đã được lưu:", result);
    res.status(200).json({ message: 'Gửi thành công' });
  } catch (err) {
    console.error("Lỗi khi lưu dữ liệu:", err);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

router.get('/getLienHe', async (req, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.execute("SELECT id, ten, phone, messenger, created_at, trang_thai FROM lien_he");
    await db.end();
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách liên hệ:", err);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
});

router.put('/updateTrangThai', async (req, res) => {
  const { id, trang_thai } = req.body;

  try {
    const db = await connectDB();
    await db.execute('UPDATE lien_he SET trang_thai = ? WHERE id = ?', [trang_thai, id]);
    await db.end();
    return res.json({ success: true });
  } catch (err) {
    console.error("Lỗi khi cập nhật trạng thái:", err);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
});

router.delete('/deleteLienHe/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const db = await connectDB();
    await db.execute('DELETE FROM lien_he WHERE id = ?', [id]);
    await db.end();
    return res.json({ success: true });
  } catch (err) {
    console.error("Lỗi khi xoá liên hệ:", err);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
});


module.exports = router;
