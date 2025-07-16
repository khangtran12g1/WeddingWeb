const express = require('express');
const router = express.Router();
const connectDB = require('../../db');

router.get('/productDetail/:id/details', async (req, res) => {
  const productId = req.params.id;
  const db = await connectDB();

  try {
    const [productRows] = await db.execute(`
      SELECT 
        p.id, 
        p.subcategory_id,
        sc.name AS subcategory_name,
        sc.category_id,
        c.name AS category_name,
        p.package_id,
        p.name,
        p.short_description,
        p.full_description,
        p.price,
        p.type
      FROM products p
      JOIN subcategories sc ON p.subcategory_id = sc.id
      JOIN categories c ON sc.category_id = c.id
      WHERE p.id = ?
    `, [productId]);

    const product = productRows[0];
    if (!product) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });

    // 2. Lấy ảnh sản phẩm
    const [imageRows] = await db.execute(
      'SELECT id, product_id, image_url FROM product_images WHERE product_id = ?',
      [productId]
    );

    // 3. Trả kết quả
    res.json({
      success: true,
      data: {
        ...product,
        images: imageRows
      }
    });

  } catch (err) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  } finally {
    await db.end();
  }
});


module.exports = router;
