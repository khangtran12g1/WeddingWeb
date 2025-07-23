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

// li do

router.post('/saveLido', upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  const file = req.file;

  if (!title || !content) {
    return res.status(400).json({ message: "Thiếu dữ liệu gửi lên" });
  }

  try {
    const db = await connectDB();
    // Upload ảnh lên Cloudinary
    let imageUrl = null;
    if (file) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'Wedding/LyDo' },
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
    }

    // Insert vào CSDL
    const sql = 'INSERT INTO ly_do (tieu_de, mo_ta, icon_url) VALUES (?, ?, ?)';
    await db.execute(sql, [title, content, imageUrl]);

    res.status(200).json({ message: 'Thêm lý do thành công!' });
    await db.end();
  } catch (err) {
    console.error('❌ Lỗi khi xử lý thêm lý do:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

router.get('/getLido', async (req, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.execute('SELECT * FROM ly_do ORDER BY id DESC');
    await db.end();

    // Chuyển về dạng frontend đang cần
    const data = rows.map((row) => ({
      id: row.id,
      title: row.tieu_de,
      content: row.mo_ta,
      image_url: row.icon_url,
    }));

    res.status(200).json(data);
  } catch (err) {
    console.error('❌ Lỗi khi lấy danh sách lý do:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy lý do' });
  }
});

router.put('/updateLido/:id', upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  const file = req.file;
  const id = req.params.id;

  if (!title || !content || !id) {
    return res.status(400).json({ message: "Thiếu dữ liệu gửi lên" });
  }

  try {
    const db = await connectDB();

    let imageUrl = null;

    if (file) {
      // Nếu có ảnh mới, upload lên Cloudinary
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'Wedding/LyDo' },
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
    }

    // Cập nhật dữ liệu
    let sql, params;

    if (imageUrl) {
      sql = `UPDATE ly_do SET tieu_de = ?, mo_ta = ?, icon_url = ? WHERE id = ?`;
      params = [title, content, imageUrl, id];
    } else {
      sql = `UPDATE ly_do SET tieu_de = ?, mo_ta = ? WHERE id = ?`;
      params = [title, content, id];
    }

    await db.execute(sql, params);
    await db.end();

    res.status(200).json({ message: "Cập nhật lý do thành công!" });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật lý do:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.delete('/deleteLido/:id', async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Thiếu ID lý do cần xoá" });
  }

  try {
    const db = await connectDB();
    const [result] = await db.execute('DELETE FROM ly_do WHERE id = ?', [id]);
    await db.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy lý do để xoá" });
    }

    res.status(200).json({ message: "Xoá lý do thành công!" });
  } catch (err) {
    console.error("❌ Lỗi khi xoá lý do:", err);
    res.status(500).json({ message: "Lỗi server khi xoá lý do" });
  }
});


router.get('/getVideo', async (req, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.execute("SELECT * FROM video ORDER BY id DESC LIMIT 1");
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

router.post('/saveVideoContent', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ success: false, message: "Thiếu nội dung" });
  }

  try {
    const db = await connectDB();
    const [rows] = await db.execute("SELECT * FROM video LIMIT 1");

    if (rows.length > 0) {
      await db.execute("UPDATE video SET mo_ta = ? WHERE id = ?", [content, rows[0].id]);
    } else {
      await db.execute("INSERT INTO video (mo_ta) VALUES (?)", [content]);
    }

    await db.end();
    return res.json({ success: true, message: "Lưu thành công" });
  } catch (err) {
    console.error("Lỗi khi lưu giới thiệu:", err);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
});

router.post('/saveVideoUrl', async (req, res) => {
  const { link } = req.body;

  if (!link) {
    return res.status(400).json({ success: false, message: "Thiếu nội dung" });
  }

  try {
    const db = await connectDB();
    const [rows] = await db.execute("SELECT * FROM video LIMIT 1");

    if (rows.length > 0) {
      await db.execute("UPDATE video SET video_url = ? WHERE id = ?", [link, rows[0].id]);
    } else {
      await db.execute("INSERT INTO video (video_url) VALUES (?)", [link]);
    }

    await db.end();
    return res.json({ success: true, message: "Lưu thành công" });
  } catch (err) {
    console.error("Lỗi khi lưu giới thiệu:", err);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
});
module.exports = router;
