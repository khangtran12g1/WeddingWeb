const express = require('express')
const router = express.Router();
const connectDB = require('../db');
const { PORT, BASE_URL } = require('../link');
const cloudinary = require('../cloudinary');
const streamifier = require('streamifier');
const multer = require('multer');



router.post('/addCategory', async(req, res) => {
    const {name} = req.body;
    console.log(name);
    try {
        const db = await connectDB();
        const [existingTag] = await db.execute(
            'SELECT * FROM categories WHERE name = ?',
            [name]
        );
        if(existingTag.length>0){
            return res.json({success:false,message:'Tên category đã tồn tại'})
        }

        await db.execute(
            'INSERT INTO categories (name) VALUES (?)',
            [name]
        );
        await db.end();
        return res.json({success: true, message:"Thêm thành công"});
    }catch(error){
        console.error('Lỗi khi thêm:', error);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
})

// Route: Lấy danh sách category
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

router.put('/updateCategory/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Tên category không hợp lệ' });
  }

  try {
    const db = await connectDB();
    const [existing] = await db.execute(
      'SELECT * FROM categories WHERE name = ? AND id != ?',
      [name, id]
    );

    if (existing.length > 0) {
      await db.end();
      return res.json({ success: false, message: 'Tên category đã tồn tại' });
    }

    // Thực hiện cập nhật
    const [result] = await db.execute(
      'UPDATE categories SET name = ? WHERE id = ?',
      [name, id]
    );

    await db.end();

    if (result.affectedRows === 0) {
      return res.json({ success: false, message: 'Không tìm thấy category để cập nhật' });
    }

    return res.json({ success: true, message: 'Cập nhật thành công' });
  } catch (error) {
    console.error('Lỗi khi cập nhật:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});
router.delete('/deleteCategory/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const db = await connectDB();

    const [existing] = await db.execute('SELECT * FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      await db.end();
      return res.json({ success: false, message: 'Category không tồn tại' });
    }

    //kiểm tra ràng buộc (ví dụ có subcategory thì không xóa)
    const [subCheck] = await db.execute('SELECT * FROM subcategories WHERE category_id = ?', [id]);
    if (subCheck.length > 0) {
      await db.end();
      return res.json({ success: false, message: 'Không thể xóa vì còn subcategory liên quan' });
    }

    // Thực hiện xoá
    const [result] = await db.execute('DELETE FROM categories WHERE id = ?', [id]);
    await db.end();

    return res.json({ success: true, message: 'Xóa category thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa category:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});



const storage = multer.memoryStorage();
const upload = multer({ storage });
// Route thêm subcategory và upload ảnh lên Cloudinary
router.post('/addSubcategory', upload.single('image'), async (req, res) => {
  const { name, description, category_id } = req.body;
  const file = req.file;

  if (!name || !description || !category_id || !file) {
    return res.status(400).json({ success: false, message: 'Thiếu dữ liệu' });
  }

  try {
    const db = await connectDB();

    // Check trùng tên
    const [exists] = await db.execute(
      'SELECT * FROM subcategories WHERE name = ? AND category_id = ?',
      [name, category_id]
    );
    if (exists.length > 0) {
      return res.json({ success: false, message: 'Tên subcategory đã tồn tại' });
    }

    // Upload ảnh lên Cloudinary từ buffer
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'Wedding' },
      async (error, result) => {
        if (error) {
          console.error('Upload thất bại:', error);
          return res.status(500).json({ success: false, message: 'Upload ảnh thất bại' });
        }

        // Lưu vào DB
        await db.execute(
          'INSERT INTO subcategories (name, description, category_id, image) VALUES (?, ?, ?, ?)',
          [name, description, category_id, result.secure_url]
        );
        await db.end();
        return res.json({ success: true, message: 'Thêm thành công' });
      }
    );

    // Dùng streamifier để biến buffer thành stream
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  } catch (err) {
    console.error('Lỗi backend:', err);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});


router.get('/getListSubCategory', async (req, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.execute(`
      SELECT 
        sub.id,
        sub.name,
        sub.category_id,
        cat.name AS category_name,
        sub.description,
        sub.image
      FROM subcategories sub
      JOIN categories cat ON sub.category_id = cat.id
    `);
      await db.end();
    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách subcategory:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

router.put('/updateSubcategory/:id', upload.single('image'), async (req, res) => {
  const { name, description, category_id } = req.body;
  const file = req.file;
  const subcategoryId = req.params.id;

  if (!name || !description || !category_id) {
    return res.status(400).json({ success: false, message: 'Thiếu dữ liệu' });
  }

  try {
    const db = await connectDB();

    // Kiểm tra subcategory có tồn tại
    const [existingRows] = await db.execute(
      'SELECT * FROM subcategories WHERE id = ?',
      [subcategoryId]
    );

    if (existingRows.length === 0) {
      await db.end();
      return res.status(404).json({ success: false, message: 'Subcategory không tồn tại' });
    }

    // Nếu có ảnh mới → upload lên Cloudinary
    if (file) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'Wedding' },
        async (error, result) => {
          if (error) {
            console.error('Upload ảnh lỗi:', error);
            await db.end();
            return res.status(500).json({ success: false, message: 'Upload ảnh thất bại' });
          }

          // Cập nhật DB với ảnh mới
          await db.execute(
            'UPDATE subcategories SET name = ?, description = ?, category_id = ?, image = ? WHERE id = ?',
            [name, description, category_id, result.secure_url, subcategoryId]
          );
          await db.end();
          return res.json({ success: true, message: 'Cập nhật thành công (có ảnh)' });
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    } else {
      // Không có ảnh mới → chỉ update name, desc, category
      await db.execute(
        'UPDATE subcategories SET name = ?, description = ?, category_id = ? WHERE id = ?',
        [name, description, category_id, subcategoryId]
      );
      await db.end();
      return res.json({ success: true, message: 'Cập nhật thành công (không đổi ảnh)' });
    }
  } catch (err) {
    console.error('Lỗi backend:', err);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

router.delete('/deleteSubcategory/:id', async (req, res) => {
  const subcategoryId = req.params.id;

  try {
    const db = await connectDB();

    // Kiểm tra tồn tại
    const [exists] = await db.execute(
      'SELECT * FROM subcategories WHERE id = ?',
      [subcategoryId]
    );

    if (exists.length === 0) {
      await db.end();
      return res.status(404).json({ success: false, message: 'Subcategory không tồn tại' });
    }

    // Xoá subcategory
    await db.execute('DELETE FROM subcategories WHERE id = ?', [subcategoryId]);
    await db.end();

    return res.json({ success: true, message: 'Xoá thành công' });
  } catch (err) {
    console.error('Lỗi khi xoá subcategory:', err);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

  router.post('/addPackage', async (req, res) => {
  const { name, description, subcategory_id } = req.body;

  if (!name || !description || !subcategory_id) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin' });
  }

  try {
    const db = await connectDB();
    const [existingPackage] = await db.execute(
      'SELECT * FROM packages WHERE name = ?',
      [name]
    );

    if (existingPackage.length > 0) {
      return res.json({ success: false, message: 'Tên package đã tồn tại' });
    }

    // Thêm vào CSDL
    await db.execute(
      'INSERT INTO packages (name, description, subcategory_id) VALUES (?, ?, ?)',
      [name, description, subcategory_id]
    );
    await db.end();
    return res.json({ success: true, message: 'Thêm thành công' });
  } catch (error) {
    console.error('Lỗi khi thêm:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

  router.get('/getListPackage', async (req, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.execute(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.subcategory_id,
        s.name AS subcategory_name
      FROM packages p
      JOIN subcategories s ON p.subcategory_id = s.id
    `);
      await db.end();
    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách package:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

router.put('/updatePackage/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, subcategory_id } = req.body;

  if (!name || !description || !subcategory_id) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin' });
  }

  try {
    const db = await connectDB();

    // Kiểm tra package có tồn tại không
    const [existing] = await db.execute('SELECT * FROM packages WHERE id = ?', [id]);
    if (existing.length === 0) {
      await db.end();
      return res.status(404).json({ success: false, message: 'Package không tồn tại' });
    }

    // Kiểm tra tên package có bị trùng (với package khác không)
    const [conflict] = await db.execute(
      'SELECT * FROM packages WHERE name = ? AND id != ?',
      [name, id]
    );
    if (conflict.length > 0) {
      await db.end();
      return res.json({ success: false, message: 'Tên package đã tồn tại' });
    }

    // Cập nhật
    await db.execute(
      'UPDATE packages SET name = ?, description = ?, subcategory_id = ? WHERE id = ?',
      [name, description, subcategory_id, id]
    );

    await db.end();
    return res.json({ success: true, message: 'Cập nhật thành công' });
  } catch (error) {
    console.error('Lỗi khi cập nhật package:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

router.delete('/deletePackage/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const db = await connectDB();

    // Kiểm tra package có tồn tại không
    const [existing] = await db.execute('SELECT * FROM packages WHERE id = ?', [id]);
    if (existing.length === 0) {
      await db.end();
      return res.status(404).json({ success: false, message: 'Package không tồn tại' });
    }

    // Xoá package
    await db.execute('DELETE FROM packages WHERE id = ?', [id]);
    await db.end();

    return res.json({ success: true, message: 'Xóa package thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa package:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});





module.exports = router;