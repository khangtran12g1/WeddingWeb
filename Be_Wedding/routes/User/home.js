const express = require('express')
const router = express.Router();
const connectDB = require('../../db');
const { PORT, BASE_URL } = require('../../link');

router.get("/getListCategorySubcategory", async (req, res) => {
  try {
    const db = await connectDB();
    const [categories] = await db.execute("SELECT * FROM categories");
    const [subcategories] = await db.execute("SELECT * FROM subcategories");
    
    const result = categories.map((cat) => {
      const subs = subcategories.filter((sub) => sub.category_id === cat.id);
      return {
        ...cat,
        subcategories: subs,
      };
    });
    await db.end();
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

module.exports = router;