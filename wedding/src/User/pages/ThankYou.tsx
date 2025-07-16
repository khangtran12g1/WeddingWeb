import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import {BASE_URL} from "../../../link"
import axios from "axios";
import { useCart } from "../components/CartContext";
import toast from "react-hot-toast";

interface OrderInfo {
  order_code: string;
  customer_name: string;
  phone: string;
  email: string;
  address: string;
  wedding_date: string;
  note: string;
  total: number;
  date: string;
}

export default function ThankYou() {
  const { clearCart } = useCart();
  const { state } = useLocation();
  const [searchParams] = useSearchParams();

  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);

  const isVnpay = searchParams.get("payment") === "1";
  const vnpResponseCode = searchParams.get("vnp_ResponseCode");
  const daThanhToan = vnpResponseCode === "00";

  // Nếu là COD: dùng dữ liệu từ state
  const isCod = state && !isVnpay;

  useEffect(() => {
    if (isCod) {
      setOrderInfo({
        order_code: state.orderCode,
        date: state.date,
        total: state.total,
        customer_name: "",
        phone: "",
        email: "",
        address: "",
        wedding_date: "",
        note: "",
      });
    } else if (isVnpay) {
      const stored = localStorage.getItem("pendingOrder");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setOrderInfo(parsed);
        } catch (err) {
          console.error("Lỗi parse pendingOrder:", err);
        }
      }
    }
  }, [state, isCod, isVnpay]);

  useEffect(() => {
    const sendOrderAfterVnpay = async () => {
      if (isVnpay && daThanhToan) {
        const stored = localStorage.getItem("pendingOrder");
        if (!stored) return;

        try {
          const order = JSON.parse(stored);
          const response = await axios.post(`${BASE_URL}/Order/addOrder_OrderDetail2`, {
            ...order,
            cartItems: JSON.parse(localStorage.getItem("cartItems") || "[]"),
          });

          if (response.data.success) {
            toast.success("Lưu đơn hàng sau thanh toán thành công!");

            // Clear localStorage & giỏ hàng
            localStorage.removeItem("pendingOrder");
            clearCart();
          } else {
            toast.error("Lưu đơn hàng thất bại.");
          }
        } catch (err) {
          console.error("Lỗi khi lưu đơn hàng sau VNPAY:", err);
          toast.error("Lỗi hệ thống.");
        }
      }
    };

    sendOrderAfterVnpay();
  }, [isVnpay, daThanhToan, clearCart]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-lg text-center space-y-6">
        <h1 className="text-3xl font-bold text-pink-600">
          🎉 Cảm ơn bạn đã đặt hàng!
        </h1>
        <p className="text-gray-800 text-lg">Đơn hàng của bạn đã được tiếp nhận.</p>

        <div className="bg-gray-50 rounded-lg p-4 text-left border">
          <p>
            <span className="font-semibold">📦 Mã đơn hàng:</span>{" "}
            {orderInfo?.order_code || "N/A"}
          </p>
          <p>
            <span className="font-semibold">📅 Ngày đặt:</span>{" "}
            {orderInfo?.date || "N/A"}
          </p>
          <p>
            <span className="font-semibold">💰 Tổng tiền:</span>{" "}
            {orderInfo?.total?.toLocaleString() || "0"}đ
          </p>
          {isVnpay && (
            <p>
              <span className="font-semibold">💳 Thanh toán:</span>{" "}
              {daThanhToan ? (
                <span className="text-green-600 font-bold">ĐÃ THANH TOÁN</span>
              ) : (
                <span className="text-red-600 font-bold">THẤT BẠI</span>
              )}
            </p>
          )}
        </div>

        <p className="text-gray-700 mb-6">
          Chúng tôi sẽ liên hệ xác nhận sớm nhất.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
        >
          Quay về trang chủ
        </a>
      </div>
    </div>
  );
}
