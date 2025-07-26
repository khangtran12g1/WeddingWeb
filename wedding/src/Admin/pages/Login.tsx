import { useState } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../link";
import { toast, Toaster } from "react-hot-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, {
        username,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        toast.success("Đăng nhập thành công!");
        if(res.data.role==="admin"){
           setTimeout(() => {
              window.location.href = "/admin";
            }, 500);
        }else {
          setTimeout(() => {
            window.location.href = "/admin/OrderListAdmin";
            // navigate("/admin/OrderListAdmin");
            // window.location.reload();
          }, 500);
        }
          
      } else {
        toast.error(res.data.message || "Sai tài khoản hoặc mật khẩu");
      }
    } catch (err) {
      toast.error("Sai tài khoản hoặc mật khẩu",{ duration: 1500 });
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-500 to-blue-200 px-4">
        <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl transform transition-all hover:scale-[1.01]">
        <div className="flex justify-center mb-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            Đăng nhập
          </h2>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-gray-600 to-blue-300 hover:from-gray-700 hover:to-blue-700 text-white rounded-lg shadow-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}