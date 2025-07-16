const express = require('express')
const router = express.Router();
const connectDB = require('../db');
const { PORT, BASE_URL } = require('../link');
router.post('/addOrder_OrderDetail', async (req, res) => {
  const {
    order_code,
    customer_name,
    phone,
    email,
    address,
    wedding_date,
    note,
    cartItems,
  } = req.body;

  try {
    const db = await connectDB();

    // 1. Tính tổng tiền
    const total_price = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    // 2. Thêm vào bảng orders
    const [orderResult] = await db.execute(
      `INSERT INTO orders 
        (order_code, customer_name, phone, email, address, wedding_date, note, total_price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [order_code, customer_name, phone, email, address, wedding_date, note, total_price]
    );

    const orderId = orderResult.insertId;

    // 3. Thêm từng item vào order_details
    const insertDetailsQuery = `
      INSERT INTO order_details 
      (order_id, product_id, product_name, product_price, quantity, total, product_image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    for (const item of cartItems) {
      await db.execute(insertDetailsQuery, [
        orderId,
        item.id,
        item.name,
        item.price,
        item.quantity,
        item.price * item.quantity,
        item.img,
      ]);
    }

    await db.end();

    return res.json({ success: true, message: 'Đặt hàng thành công!' });
  } catch (error) {
    console.error('Lỗi khi đặt hàng:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

router.post('/addOrder_OrderDetail2', async (req, res) => {
  const {
    order_code,
    customer_name,
    phone,
    email,
    address,
    wedding_date,
    note,
    cartItems,
  } = req.body;

  try {
    const db = await connectDB();

    // 1. Tính tổng tiền
    const total_price = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    // 2. Thêm vào bảng orders
    const [orderResult] = await db.execute(
      `INSERT INTO orders 
        (order_code, customer_name, phone, email, address, wedding_date, note, total_price, payment_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [order_code, customer_name, phone, email, address, wedding_date, note, total_price, "completed"]
    );

    const orderId = orderResult.insertId;

    // 3. Thêm từng item vào order_details
    const insertDetailsQuery = `
      INSERT INTO order_details 
      (order_id, product_id, product_name, product_price, quantity, total, product_image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    for (const item of cartItems) {
      await db.execute(insertDetailsQuery, [
        orderId,
        item.id,
        item.name,
        item.price,
        item.quantity,
        item.price * item.quantity,
        item.img,
      ]);
    }

    await db.end();

    return res.json({ success: true, message: 'Đặt hàng thành công!' });
  } catch (error) {
    console.error('Lỗi khi đặt hàng:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

router.get("/getOrders", async (req, res) => {
  try {
    const db = await connectDB();
    // 1. Lấy danh sách đơn hàng
    const [orders] = await db.query("SELECT * FROM orders ORDER BY created_at DESC");

    // 2. Với mỗi đơn, lấy chi tiết sản phẩm
    const orderList = await Promise.all(
      orders.map(async (order) => {
        const [details] = await db.query("SELECT * FROM order_details WHERE order_id = ?", [order.id]);
        return {
          ...order,
          details,
        };
      })
    );
    await db.end();
    res.json(orderList);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi lấy đơn hàng" });
  }
});

// POST /order/updateDetails
router.post("/updateDetails", async (req, res) => {
  const { orderId, details } = req.body;

  if (!orderId || !Array.isArray(details)) {
    return res.status(400).json({ message: "Thiếu orderId hoặc chi tiết không hợp lệ" });
  }

  try {
    const db = await connectDB();
    // 1. Xoá chi tiết cũ
    await db.query("DELETE FROM order_details WHERE order_id = ?", [orderId]);

    // 2. Thêm mới các chi tiết
    const insertPromises = details.map((item) => {
      return db.query(
        `INSERT INTO order_details 
          (order_id, product_id, product_name, product_price, quantity, total, product_image)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product_id,
          item.product_name,
          item.product_price,
          item.quantity,
          item.total,
          item.product_image,
        ]
      );
    });

    await Promise.all(insertPromises);

    // 3. Tính lại tổng tiền
    const [totalResult] = await db.query(
      "SELECT SUM(total) AS total FROM order_details WHERE order_id = ?",
      [orderId]
    );

    const newTotal = totalResult[0]?.total || 0;

    // 4. Cập nhật bảng orders
    await db.query(
      "UPDATE orders SET total_price = ? WHERE id = ?",
      [newTotal, orderId]
    );
    await db.end();
    res.json({ success: true, message: "Cập nhật chi tiết đơn hàng thành công" });
  } catch (err) {
    console.error("Lỗi cập nhật chi tiết đơn hàng:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật đơn hàng" });
  }
});

// routes/order.js
router.post('/updateStatus', async (req, res) => {
  const { orderId, status } = req.body;
  if (!orderId || !status) {
    return res.status(400).json({ success: false, message: "Thiếu orderId hoặc status" });
  }

  try {
    const db = await connectDB();
    await db.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, orderId]
    );
    await db.end();
    res.json({ success: true, message: "Cập nhật trạng thái thành công" });
  } catch (err) {
    console.error("Lỗi cập nhật trạng thái:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

router.post('/updatePayment', async (req, res) => {
  const { orderId, payment_status } = req.body;
  if (!orderId || !payment_status) {
    return res.status(400).json({ success: false, message: "Thiếu orderId hoặc payment_status" });
  }

  try {
    const db = await connectDB();
    await db.query(
      "UPDATE orders SET payment_status = ? WHERE id = ?",
      [payment_status, orderId]
    );
    await db.end();
    res.json({ success: true, message: "Cập nhật trạng thái thành công" });
  } catch (err) {
    console.error("Lỗi cập nhật trạng thái:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});


module.exports = router;