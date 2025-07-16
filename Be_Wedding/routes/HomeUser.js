// routes/about.js
const express = require('express');
const router = express.Router();
const connectDB = require('../db'); 
const cloudinary = require('../cloudinary');
const streamifier = require('streamifier');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/setImage', upload.single('image'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ success: false, message: 'Không có ảnh nào được tải lên' });
  }

  try {
    const db = await connectDB();

    const uploadedUrl = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'Wedding' },
        (error, result) => {
          if (error) {
            console.error('Lỗi upload ảnh:', error);
            reject(error);
          } else {
            resolve(result.secure_url); 
          }
        }
      );
      streamifier.createReadStream(file.buffer).pipe(stream);
    });

    await db.execute(
      'UPDATE gioi_thieu SET image_url = ? WHERE id = 1',
      [uploadedUrl]
    );

    await db.end();
    return res.json({ success: true, message: 'Cập nhật ảnh giới thiệu thành công' });
  } catch (err) {
    console.error('Lỗi backend:', err);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});



router.post('/save', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ success: false, message: "Thiếu nội dung" });
  }

  try {
    const db = await connectDB();
    const [rows] = await db.execute("SELECT * FROM gioi_thieu LIMIT 1");

    if (rows.length > 0) {
      await db.execute("UPDATE gioi_thieu SET content = ? WHERE id = ?", [content, rows[0].id]);
    } else {
      await db.execute("INSERT INTO gioi_thieu (content) VALUES (?)", [content]);
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
    const [rows] = await db.execute("SELECT * FROM gioi_thieu ORDER BY id DESC LIMIT 1");
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
