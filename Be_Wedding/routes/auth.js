const express = require('express');
const router = express.Router();
const connectDB = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = 'khanghaha123';

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập đủ username và password' });
  }

  try {
    const db = await connectDB();
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);

    if (rows.length === 0) {
      await db.end();
      return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại' });
    }

    const user = rows[0];
    if (password !== user.password) {
        await db.end();
    return res.status(401).json({ success: false, message: 'Sai mật khẩu' });
    }

    // const passwordMatch = await bcrypt.compare(password, user.password);
    // if (!passwordMatch) {
    //   await db.end();
    //   return res.status(401).json({ success: false, message: 'Sai mật khẩu' });
    // }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    await db.end();
    return res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      role: user.role
    });

  } catch (err) {
    console.error("Lỗi khi đăng nhập:", err);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

// routes/user.js
router.get('/getUsers', async (req, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.execute("SELECT id, username, full_name, birthday, phone, role FROM users");
    await db.end();
    return res.json({ success: true, users: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
});


router.post("/addUser", async (req, res) => {
  const { full_name, username, password, phone, birthday, role } = req.body;

  if (!full_name || !username || !password) {
    return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
  }

  try {
    const db = await connectDB();

    // Kiểm tra trùng username
    const [existing] = await db.execute("SELECT id FROM users WHERE username = ?", [username]);
    if (existing.length > 0) {
      await db.end();
      return res.status(400).json({ success: false, message: "Tên đăng nhập đã tồn tại" });
    }

    // Chèn người dùng mới
    await db.execute(
      `INSERT INTO users (full_name, username, password, phone, birthday, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [full_name, username, password, phone, birthday || null, role || "staff"]
    );

    await db.end();
    return res.json({ success: true, message: "Thêm nhân viên thành công" });
  } catch (err) {
    console.error("Lỗi khi thêm nhân viên:", err);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
});

router.put("/updateUser", async (req, res) => {
  const { id, full_name, username, password, phone, birthday, role } = req.body;

  if (!id || !full_name || !username) {
    return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
  }

  try {
    const db = await connectDB();

    if (password && password.trim() !== "") {
      // Nếu có cập nhật mật khẩu
      await db.execute(
        `UPDATE users SET full_name = ?, username = ?, password = ?, phone = ?, birthday = ?, role = ?
         WHERE id = ?`,
        [full_name, username, password, phone, birthday || null, role, id]
      );
    } else {
      // Không cập nhật mật khẩu
      await db.execute(
        `UPDATE users SET full_name = ?, username = ?, phone = ?, birthday = ?, role = ?
         WHERE id = ?`,
        [full_name, username, phone, birthday || null, role, id]
      );
    }

    await db.end();
    return res.json({ success: true, message: "Cập nhật thành công" });
  } catch (err) {
    console.error("Lỗi cập nhật user:", err);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
});

router.delete("/deleteUser/:id", async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ success: false, message: "Thiếu ID người dùng" });
  }

  try {
    const db = await connectDB();

    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [userId]);

    await db.end();

    if (result.affectedRows > 0) {
      return res.json({ success: true, message: "Xoá thành công" });
    } else {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }
  } catch (err) {
    console.error("Lỗi xoá user:", err);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
});

module.exports = router;
