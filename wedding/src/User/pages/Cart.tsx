import { useCart } from "../components/CartContext";
import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

function Cart() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">🛒 Giỏ hàng của bạn</h2>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="text-lg">Giỏ hàng đang trống.</p>
          <Link to="/" className="mt-4 inline-block text-pink-600 hover:underline">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-20 h-20 object-cover rounded border"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-500 text-sm">Đơn giá: {item.price.toLocaleString()}đ</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity === 1}
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-2 font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-between items-end">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-xs text-red-300 hover:text-red-600"
                >
                  <IoMdClose size={20} />
                </button>
                <p className="font-semibold text-pink-600">
                  {(item.quantity * item.price).toLocaleString()}đ
                </p>
              </div>
            </div>
          ))}

          <div className="text-right mt-8 border-t pt-6">
            <p className="text-xl font-bold">
              Tổng cộng: <span className="text-pink-600">{total.toLocaleString()}đ</span>
            </p>
            <Link
              to="/Order"
              className="mt-4 inline-block px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
            >
              Tiến hành đặt hàng
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
