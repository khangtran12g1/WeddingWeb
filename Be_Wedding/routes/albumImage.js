const express = require('express');
const router = express.Router();
const connectDB = require('../db');
const cloudinary = require('../cloudinary');
const streamifier = require('streamifier');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route thêm album và ảnh lên Cloudinary
router.post('/addAlbum', upload.array('images'), async (req, res) => {
  const { name } = req.body;
  const files = req.files;

  if (!name || !files || files.length === 0) {
    return res.status(400).json({ success: false, message: 'Thiếu tên album hoặc ảnh' });
  }

  try {
    const db = await connectDB();

    // 1. Thêm album vào bảng gallery
    const [result] = await db.execute(
      'INSERT INTO gallery (name) VALUES (?)',
      [name]
    );
    const galleryId = result.insertId;

    // 2. Upload ảnh lên Cloudinary
    const uploadResults = await Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'Wedding/Gallery' },
            (error, result) => {
              if (error) {
                console.error('Lỗi upload ảnh:', error);
                reject(error);
              } else {
                resolve(result.secure_url); // return URL ảnh
              }
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      })
    );

    // 3. Lưu ảnh vào bảng gallery_images
    for (const url of uploadResults) {
      await db.execute(
        'INSERT INTO gallery_images (gallery_id, image_url) VALUES (?, ?)',
        [galleryId, url]
      );
    }

    await db.end();
    return res.json({ success: true, message: 'Tạo album thành công' });
  } catch (err) {
    console.error('Lỗi backend:', err);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});


router.get('/getAlbums', async (req, res) => {
  try {
    const db = await connectDB();

    // 1. Lấy tất cả album
    const [albums] = await db.execute('SELECT * FROM gallery');

    // 2. Lấy tất cả ảnh kèm gallery_id
    const [images] = await db.execute('SELECT * FROM gallery_images');

    // 3. Nhóm ảnh theo album
    const albumList = albums.map((album) => {
      const albumImages = images
        .filter((img) => img.gallery_id === album.id)
        .map((img) => img.image_url);

      return {
        id: album.id,
        name: album.name,
        images: albumImages,
      };
    });

    await db.end();

    res.json({ success: true, data: albumList });
  } catch (err) {
    console.error('Lỗi khi lấy danh sách album:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

router.get('/getAlbumId', async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Thiếu tham số id' });
  }

  try {
    const db = await connectDB();

    // 1. Lấy thông tin album theo ID
    const [albumRows] = await db.execute('SELECT * FROM gallery WHERE id = ?', [id]);

    if (albumRows.length === 0) {
      await db.end();
      return res.status(404).json({ success: false, message: 'Không tìm thấy album' });
    }

    const album = albumRows[0];

    // 2. Lấy tất cả ảnh thuộc album
    const [imageRows] = await db.execute('SELECT image_url FROM gallery_images WHERE gallery_id = ?', [id]);

    const imageUrls = imageRows.map((img) => img.image_url);

    await db.end();

    // 3. Trả về
    res.json({
      success: true,
      data: {
        id: album.id,
        name: album.name,
        images: imageUrls,
      },
    });
  } catch (err) {
    console.error('Lỗi khi lấy album:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});



// router.post('/addAlbum', upload.array('images'), async (req, res) => {
//   const { name } = req.body;
//   const files = req.files;

//   if (!name || !files || files.length === 0) {
//     return res.status(400).json({ success: false, message: 'Thiếu tên album hoặc ảnh' });
//   }

//   try {
//     const db = await connectDB();

//     // 1. Thêm album vào bảng gallery
//     const [result] = await db.execute(
//       'INSERT INTO gallery (name) VALUES (?)',
//       [name]
//     );
//     const galleryId = result.insertId;

//     // 2. Upload ảnh lên Cloudinary
//     const uploadResults = await Promise.all(
//       files.map((file) => {
//         return new Promise((resolve, reject) => {
//           const stream = cloudinary.uploader.upload_stream(
//             { folder: 'Wedding/Gallery' },
//             (error, result) => {
//               if (error) {
//                 console.error('Lỗi upload ảnh:', error);
//                 reject(error);
//               } else {
//                 resolve(result.secure_url); // return URL ảnh
//               }
//             }
//           );
//           streamifier.createReadStream(file.buffer).pipe(stream);
//         });
//       })
//     );

//     // 3. Lưu ảnh vào bảng gallery_images
//     for (const url of uploadResults) {
//       await db.execute(
//         'INSERT INTO gallery_images (gallery_id, image_url) VALUES (?, ?)',
//         [galleryId, url]
//       );
//     }

//     await db.end();
//     return res.json({ success: true, message: 'Tạo album thành công' });
//   } catch (err) {
//     console.error('Lỗi backend:', err);
//     return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
//   }
// });

router.post('/updateAlbum', upload.array('images'), async (req, res) => {
  const { id, name } = req.body;
  const files = req.files;

  if (!id || !name) {
    return res.status(400).json({ success: false, message: 'Thiếu ID hoặc tên album' });
  }

  try {
    const db = await connectDB();

    // 1. Cập nhật tên album
    await db.execute('UPDATE gallery SET name = ? WHERE id = ?', [name, id]);

    // 2. Nếu có ảnh mới được chọn thì xử lý ảnh
    if (files && files.length > 0) {
      // 2.1. Xóa tất cả ảnh cũ khỏi bảng gallery_images
      await db.execute('DELETE FROM gallery_images WHERE gallery_id = ?', [id]);

      // 2.2. Upload ảnh mới lên Cloudinary
      const uploadResults = await Promise.all(
        files.map((file) => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: 'Wedding/Gallery' },
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
        })
      );

      // 2.3. Lưu lại ảnh mới vào bảng gallery_images
      for (const url of uploadResults) {
        await db.execute(
          'INSERT INTO gallery_images (gallery_id, image_url) VALUES (?, ?)',
          [id, url]
        );
      }
    }

    await db.end();
    return res.json({ success: true, message: 'Cập nhật album thành công' });
  } catch (err) {
    console.error('Lỗi backend:', err);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});


router.delete('/deleteAlbum/:id', async (req, res) => {
  const albumId = req.params.id;

  try {
    const db = await connectDB();

    // Xoá ảnh trong bảng gallery_images
    await db.execute(
      'DELETE FROM gallery_images WHERE gallery_id = ?',
      [albumId]
    );

    // Xoá album
    await db.execute(
      'DELETE FROM gallery WHERE id = ?',
      [albumId]
    );

    await db.end();
    res.json({ success: true, message: 'Xóa album thành công' });
  } catch (err) {
    console.error('Lỗi khi xóa album:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi xóa album' });
  }
});

module.exports = router;
