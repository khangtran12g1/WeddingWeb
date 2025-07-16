// src/User/pages/Order.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import {BASE_URL} from "../../../link"

interface OrderForm {
  name: string;
  phone: string;
  email: string;
  address: string;
  weddingDate: string;
  note: string;
}
function generateOrderCode() {
  const date = new Date();
  const yyyyMMdd = date.toISOString().slice(0, 10).replace(/-/g, ""); // 20250706
  const random = Math.random().toString(36).substring(2, 8).toUpperCase(); // ABC123
  return `ORD${yyyyMMdd}-${random}`;
}

export default function Order() {
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "vnpay">("cod");

  const navigate = useNavigate();
  const { cartItems, removeFromCart,clearCart } = useCart();
  const [form, setForm] = useState<OrderForm>({
    name: "",
    phone: "",
    email: "",
    address: "",
    weddingDate: "",
    note: "",
  });
  const total = cartItems.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const order_code = generateOrderCode();
    if(paymentMethod==='cod'){
      try {
        const response = await axios.post(`${BASE_URL}/Order/addOrder_OrderDetail`, {
          order_code: order_code,
          customer_name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          wedding_date: form.weddingDate,
          note: form.note,
          cartItems,
        });

        if (response.data.success) {
          toast.success("Đặt hàng thành công!");
          navigate("/ThankYou", {
            state: {
              date: new Date().toLocaleDateString("vi-VN"),
              total: total,
              orderCode: order_code,
            },
          });
          clearCart();
        } else {
          toast.error(response.data.message || "Có lỗi xảy ra khi đặt hàng");
        }
      } catch (err) {
        console.error(err);
        toast.error("Lỗi máy chủ. Vui lòng thử lại sau.");
      }
    }else {
      try {
        localStorage.setItem('pendingOrder', JSON.stringify({
          order_code: order_code,
          customer_name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          wedding_date: form.weddingDate,
          note: form.note,
          total : total,
          date: new Date().toLocaleDateString("vi-VN")
        }));

        const res = await axios.post(`${BASE_URL}/vnpay/create_payment_url`, {
          amount: total,
          bankCode: 'ncb',
          language: 'vn',
          date: new Date().toISOString(),
          order_code,
        });

        window.location.href = res.data.paymentUrl;
      } catch (err) {
        console.error(err);
        toast.error("Không thể kết nối đến VNPAY");
      }
    }
    
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="md:flex">
          {/* Left: Form Thông tin khách hàng */}
          <div className="md:w-2/3 p-8">
            <h2 className="text-3xl font-extrabold text-pink-600 mb-6">Thông tin khách hàng</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Họ và tên"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-pink-500 focus:ring-1 focus:ring-pink-300"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Số điện thoại"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-pink-500 focus:ring-1 focus:ring-pink-300"
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email (nếu có)"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-pink-500 focus:ring-1 focus:ring-pink-300"
              />
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Địa chỉ tổ chức"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-pink-500 focus:ring-1 focus:ring-pink-300"
              />
              <input
                name="weddingDate"
                type="date"
                value={form.weddingDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-pink-500 focus:ring-1 focus:ring-pink-300"
              />
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Ghi chú thêm (nếu có)"
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-pink-500 focus:ring-1 focus:ring-pink-300"
              />

              <button
                type="submit"
                disabled={cartItems.length === 0}
                className="w-full bg-pink-600 text-white font-semibold py-3 rounded-xl hover:bg-pink-700 transition disabled:opacity-50"
              >
                Xác nhận đặt hàng
              </button>
            </form>
          </div>

          {/* Right: Đơn hàng và thanh toán */}
          <div className="md:w-1/3 bg-pink-50 p-8">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Tóm tắt đơn hàng</h3>

            <div className="space-y-4 mb-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.img} alt="" className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × {item.price.toLocaleString()}đ
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-300 pt-4 mb-6">
              <p className="text-lg font-semibold text-gray-800">
                Tổng cộng: <span className="text-pink-600">{total.toLocaleString()}đ</span>
              </p>
            </div>

            {/* Chọn phương thức thanh toán */}
            <div className="bg-white rounded-lg border border-gray-300 p-4">
              <h4 className="font-semibold text-gray-700 mb-3">Phương thức thanh toán</h4>

              <label className="flex items-center space-x-2 mb-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <span>Thanh toán khi nhận hàng (COD)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="vnpay"
                  checked={paymentMethod === "vnpay"}
                  onChange={() => setPaymentMethod("vnpay")}
                />
                <span>Thanh toán qua VNPAY</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
