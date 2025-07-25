import React, { useState } from "react";
import {BASE_URL} from "../../../link"
import axios from "axios";
import toast from "react-hot-toast";
export default function LienHe() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await axios.post(`${BASE_URL}/lienHe/send`, form);

    if (res.status === 200) {
      setSent(true);
      setForm({ name: "", phone: "", message: "" });
      toast.success("Gửi thành công");
    }
  } catch (error) {
    console.error("Lỗi gửi liên hệ:", error);
    toast.error("Gửi không thành công");
  }
};


  return (
    <div className="relative min-h-screen bg-white py-10 px-4 md:px-32">
      <h1 className="text-4xl font-extrabold text-center text-red-600 uppercase mb-10">
        Liên hệ với Phú Thê Wedding
      </h1>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Thông tin liên hệ */}
        <div className="space-y-5 text-gray-700">
          <h2 className="text-xl font-bold text-red-500 mb-2">Thông tin liên hệ</h2>
          <div className="space-y-2">
            <p><strong>📍 Địa chỉ:</strong> 172/24 Đường Hoa Cưới, Thủ Dầu Một, Bình Dương</p>
            <p><strong>📞 Hotline:</strong> 0354 471 556</p>
            <p><strong>📧 Email:</strong> hothituongvon@gmail.com</p>
            <p><strong>🕒 Giờ làm việc:</strong> 8:00 - 20:00 (Thứ 2 - Chủ nhật)</p>
          </div>

          <div className="mt-6 rounded-lg shadow overflow-hidden">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.367437089143!2d106.66410307573956!3d10.783002089374875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ee99d353ddb%3A0x15710778c43eaa5c!2zMTIzIMSQ4buLbmggSG9hIEN14buTbSwgUXXhuq1uIDUsIFRow6BuaCBwaOG7kSwgVGjDoG5oIHBo4buRIEjDoCBDaMOidSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1710000000000!5m2!1svi!2s"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Form liên hệ */}
        <div>
          <h2 className="text-xl font-bold text-red-500 mb-4">Gửi tin nhắn cho chúng tôi</h2>

          {sent && (
            <div className="bg-green-100 text-green-800 p-4 rounded mb-4 text-center font-medium">
              ✅ Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg shadow-lg">
            <input
              name="name"
              type="text"
              required
              placeholder="Họ và tên"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-red-400"
            />
            <input
              name="phone"
              type="number"
              required
              placeholder="phone của bạn"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-red-400"
            />
            <textarea
              name="message"
              required
              placeholder="Nội dung tin nhắn"
              value={form.message}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-red-400"
              rows={6}
            />
            <button
              type="submit"
              className="w-full bg-red-500 text-white font-bold py-2 rounded hover:bg-red-600 transition"
            >
              Gửi liên hệ
            </button>
          </form>
        </div>
      </div>

      {/* Thanh công cụ nổi */}
     
    </div>
  );
}
