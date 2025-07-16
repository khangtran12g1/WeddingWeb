const express = require('express')
const router = express.Router();
const connectDB = require('../../db');
const { PORT, BASE_URL } = require('../../link');

router.get("/product_subcategory/:id/details", async (req, res) => {
  const subId = req.params.id;
  const db = await connectDB();

  // 1. Lấy thông tin subcategory
  const [subRows] = await db.execute("SELECT * FROM subcategories WHERE id = ?", [subId]);
  const sub = subRows[0];
  if (!sub) return res.status(404).json({ success: false, message: "Không tìm thấy subcategory" });

  // 2. Lấy tất cả packages trong subcategory
  const [packages] = await db.execute("SELECT * FROM packages WHERE subcategory_id = ?", [subId]);

  // 3. Lấy tất cả sản phẩm trong subcategory
  const [products] = await db.execute("SELECT * FROM products WHERE subcategory_id = ?", [subId]);

  // 4. Lấy ảnh của các sản phẩm
  const productIds = products.map(p => p.id);

  let images = []; // default empty array

  if (productIds.length > 0) {
    const placeholders = productIds.map(() => '?').join(',');
    const [result] = await db.execute(
      `SELECT * FROM product_images WHERE product_id IN (${placeholders})`,
      productIds
    );
    images = result;
  }

  // 5. Gắn ảnh vào từng sản phẩm
  const productsWithImages = products.map(product => ({
    ...product,
    images: images
      .filter(img => img.product_id === product.id)
      .map(img => img.image_url)
  }));

  // 6. Group sản phẩm theo từng package
  const packagesWithProducts = packages.map(pkg => ({
    ...pkg,
    products: productsWithImages.filter(p => p.package_id === pkg.id)
  }));

  // 7. Tạo gói mặc định chứa tất cả sản phẩm
  const defaultPackage = {
    id: 0,
    name: "TẤT CẢ",
    products: productsWithImages,
    description: "Tất Cả Sản Phẩm"
  };

  res.json({
    success: true,
    data: {
      ...sub,
      packages: [defaultPackage, ...packagesWithProducts]
    }
  });

  await db.end();
});



router.get("/subcategory_category/:id/subcategories", async (req, res) => {
  const categoryId = req.params.id;
  const db = await connectDB();

  try {
    // Lấy danh sách các subcategory thuộc category
    const [rows] = await db.execute(
      "SELECT * FROM subcategories WHERE category_id = ?",
      [categoryId]
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Lỗi truy vấn subcategories:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  } finally {
    await db.end();
  }
});


module.exports = router;