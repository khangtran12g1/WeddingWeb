const express = require('express')
const router = express.Router();
const connectDB = require('../db');
const { PORT, BASE_URL } = require('../link');
const cloudinary = require('../cloudinary');
const streamifier = require('streamifier');
const multer = require('multer');




const storage = multer.memoryStorage();
const upload = multer({ storage });
// Route thêm subcategory và upload ảnh lên Cloudinary
router.post('/addProduct', upload.array('images'), async (req, res) => {
  const {
    name,
    subCategoryId,
    packageId,
    short_Description,
    full_Description,
    price,
    type
  } = req.body;

  const files = req.files;

  if (!name || !short_Description || !full_Description || !subCategoryId || !price || !type || !files?.length) {
    return res.status(400).json({ success: false, message: 'Thiếu dữ liệu đầu vào' });
  }

  try {
    const db = await connectDB();

    // Thêm vào bảng products
    const [result] = await db.execute(
      `INSERT INTO products (subcategory_id, package_id, name, short_description, full_description, price, type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        Number(subCategoryId),
        packageId ? Number(packageId) : null,
        name,
        short_Description,
        full_Description,
        Number(price),
        type,
      ]
    );

    const productId = result.insertId;

    // Upload từng ảnh lên Cloudinary
    // 1. Upload tất cả ảnh song song
    const uploadResults = await Promise.all(
    files.map((file) => {
        return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'Wedding' },
            (error, result) => {
            if (error) {
                console.error('Lỗi upload ảnh:', error);
                reject(error);
            } else {
                resolve(result.secure_url); // chỉ return URL
            }
            }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
        });
    })
    );

    // 2. Sau khi upload xong, insert ảnh vào DB
    for (const url of uploadResults) {
    await db.execute(
        'INSERT INTO product_images (product_id, image_url) VALUES (?, ?)',
        [productId, url]
    );
    }
    await db.end();
    return res.json({ success: true, message: 'Thêm sản phẩm thành công' });
  } catch (err) {
    console.error('Lỗi backend:', err);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

router.get('/getListProduct', async (req, res) => {
  try {
    const db = await connectDB();

    // 1. Lấy danh sách sản phẩm kèm tên subcategory & package
    const [products] = await db.execute(`
      SELECT 
        p.id, p.name, p.price, p.type, p.short_description, p.full_description,
        s.id AS subcategory_id, s.name AS subcategory_name, s.category_id,
        pk.id AS package_id, pk.name AS package_name
      FROM products p
      LEFT JOIN subcategories s ON p.subcategory_id = s.id
      LEFT JOIN packages pk ON p.package_id = pk.id
    `);

    // 2. Lấy tất cả ảnh của sản phẩm
    const [images] = await db.execute(`
      SELECT product_id, image_url FROM product_images
    `);

    // 3. Gộp ảnh tương ứng vào từng sản phẩm
    const productList = products.map((product) => {
      const productImages = images
        .filter((img) => img.product_id === product.id)
        .map((img) => img.image_url);

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        type: product.type,
        short_description: product.short_description,
        full_description: product.full_description,
        subcategory: {
          id: product.subcategory_id,
          name: product.subcategory_name,
          category_id: product.category_id,
        },
        package: product.package_id
          ? { id: product.package_id, name: product.package_name }
          : null,
        images: productImages,
      };
    });
    await db.end();
    return res.json({ success: true, data: productList });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Lỗi máy chủ khi truy vấn sản phẩm' });
  }
});

router.put('/updateProduct/:id', upload.array('images'), async (req, res) => {
  const {
    name,
    subCategoryId,
    packageId,
    short_Description,
    full_Description,
    price,
    type
  } = req.body;
  const files = req.files;
  const productId = req.params.id;
  console.log(packageId);
  if (!productId || !name || !short_Description || !full_Description || !subCategoryId || !price || !type) {
    return res.status(400).json({ success: false, message: 'Thiếu dữ liệu đầu vào' });
  }

  try {
    const db = await connectDB();

    // 1. Cập nhật thông tin sản phẩm
    await db.execute(
      `UPDATE products 
       SET subcategory_id = ?, package_id = ?, name = ?, short_description = ?, full_description = ?, price = ?, type = ?
       WHERE id = ?`,
      [
        Number(subCategoryId),
        packageId ? Number(packageId) : null,
        name,
        short_Description,
        full_Description,
        Number(price),
        type,
        productId
      ]
    );

    // 2. Nếu có ảnh mới => xoá ảnh cũ trong DB và upload ảnh mới
    if (files && files.length > 0) {
      // Xoá ảnh cũ trong DB
      await db.execute(
        `DELETE FROM product_images WHERE product_id = ?`,
        [productId]
      );

      // Upload ảnh mới lên Cloudinary
      const uploadResults = await Promise.all(
        files.map((file) => {
          return new Promise((resolve, reject) => {
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
        })
      );

      // Thêm ảnh mới vào DB
      for (const url of uploadResults) {
        await db.execute(
          'INSERT INTO product_images (product_id, image_url) VALUES (?, ?)',
          [productId, url]
        );
      }
    }

    await db.end();
    return res.json({ success: true, message: 'Cập nhật sản phẩm thành công' });

  } catch (err) {
    console.error('Lỗi backend:', err);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi cập nhật sản phẩm' });
  }
});

router.delete('/deleteProduct/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const db = await connectDB();

    // Xoá ảnh trong bảng product_images
    await db.execute('DELETE FROM product_images WHERE product_id = ?', [productId]);

    // Xoá sản phẩm chính
    await db.execute('DELETE FROM products WHERE id = ?', [productId]);

    await db.end();
    return res.json({ success: true, message: 'Xoá sản phẩm thành công' });
  } catch (err) {
    console.error('Lỗi khi xoá sản phẩm:', err);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});






  
 
 





module.exports = router;