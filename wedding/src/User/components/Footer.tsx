import logo from "../image/logo_phuthe.png";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt,FaPhoneAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";



function Footer() {
  return (
    <>
      <footer className="mt-auto bg-[#FFFFA6] font-timesnewroman py-4 text-center text-sm text-white">
        <div className="md:grid md:grid-cols-4 md:gap-4 md:px-5">
          <div className="flex flex-col items-center justify-start p-4">
            <img src={logo} />
            <h2 className="text-xl font-bold text-red-600">
              Uy tín chất lượng tạo nên thương hiệu
            </h2>
          </div>
          <div className="flex flex-col items-start justify-start gap-4 p-4 [&>a]:text-lg [&>a]:text-gray-600">
            <h2 className="text-xl font-bold text-black">
              CHĂM SÓC KHÁCH HÀNG
            </h2>
            <Link className="hover:text-black" to="/">
              Giới Thiệu
            </Link>
            <Link className="hover:text-black" to="/">
              Liên Hệ
            </Link>
            <Link className="hover:text-black" to="/">
              Chính Sách Vận Chuyển
            </Link>
            <Link className="hover:text-black" to="/">
              Hình Thức Thanh Toán
            </Link>
            <Link className="hover:text-black" to="/">
              Xử Lý Khiếu Nại
            </Link>
          </div>
          <div className="flex flex-col items-start justify-start gap-4 p-4 [&>a]:text-left [&>a]:font-sans [&>a]:text-lg [&>a]:text-gray-600">
            <h2 className="font-serif text-xl font-bold text-black">
              CƯỚI HỎI PHU THÊ
            </h2>
            <a
              className="flex gap-2 items-start hover:text-black"
              target="_blank"
              href="https://www.google.com/maps/place/Trang+Tr%C3%AD+Gia+Ti%C3%AAn,+C%C6%B0%E1%BB%9Bi+H%E1%BB%8Fi,+M%C3%A2m+Qu%E1%BA%A3+C%C6%B0%E1%BB%9Bi+Tr%E1%BB%8Dn+G%C3%B3i+PhutheWedding/@10.7670402,106.6768357,17z/data=!3m1!4b1!4m6!3m5!1s0x31752f1fa04d475f:0x644046e7a4104eb4!8m2!3d10.7670349!4d106.6794106!16s%2Fg%2F11dxqds7k1?hl=vi&entry=tts"
            >
              <FaMapMarkerAlt className="w-5 h-5 mt-1"/>
              Địa chỉ: 756 Nguyễn Đình Chiểu – P.1 – Q.3 – TP. Hồ Chí Minh
            </a>
            <a href="tel:0967784511" className="flex hover:text-black gap-2">
              <FaPhoneAlt className="w-5 h-5 mt-1" />
              Điện thoại: 0967784511
            </a>
            <a className="flex gap-2 hover:text-black">
              <IoMail className="w-5 h-5 mt-1" />
              Email: khangtran12g1@gmail.com
            </a>
          </div>
          <div className="flex flex-col items-start justify-start gap-4 p-4 [&>a]:font-serif [&>a]:text-base [&>a]:text-gray-600">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5752009502125!2d106.6793065!3d10.767185600000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1fa04d475f%3A0x644046e7a4104eb4!2zVHJhbmcgVHLDrSBHaWEgVGnDqm4sIEPGsOG7m2kgSOG7j2ksIE3Dom0gUXXhuqMgQ8aw4bubaSBUcuG7jW4gR8OzaSBQaHV0aGVXZWRkaW5n!5e0!3m2!1svi!2s!4v1750162773825!5m2!1svi!2s"
              width="100%"
              height="130"
              style={{ border: "0" }}
              allowFullScreen
              loading="lazy"
            ></iframe>
            <a
              className="w-full hover:text-black"
              target="_blank"
              href="https://www.facebook.com/tran.an.khang.993446/?locale=vi_VN"
            >
              <img
                loading="lazy"
                src="https://phuthewedding.com/wp-content/uploads/2023/03/fanpage-cuoihoiphuthe.jpg"
                style={{ height: 130, width: "100%" }}
                className="object-cover"
              />
            </a>
          </div>
        </div>
        © 2025 AMI Wedding. All rights reserved.
      </footer>
    </>
  );
}

export default Footer;
