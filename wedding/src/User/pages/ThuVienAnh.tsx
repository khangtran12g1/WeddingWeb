import { Link } from "react-router-dom";

const items = [
  { id:1, image: "img/tva1.jpg", name: "Trang Trí Lễ Gia Tiên Vu Quy Của Chú Rể Thiên Phú  Và Cô Dâu Uyên My" },
  { id:2, image: "img/tva2.jpg", name: "Trang Trí Gia Tiên Trắng Hồng Sang Trọng Cô Dâu : Thanh Xuân Và Chú Rể Tây LANGER YANN 28-2-2025" },
  { id:3, image: "img/tva3.jpg", name: "Trang Trí Lễ Gia Tiên Tân Hôn Hoa Tươi Của Chú Rể Lê Khánh Và Cô Dâu Phạm Thúy" },
  { id:4, image: "img/tva4.jpg", name: "Trang Trí Lễ Gia Tiên Vu Quy Của Chú Rể Thiên Phú  Và Cô Dâu Uyên My" },
  { id:5, image: "img/tva5.jpg", name: "Trang Trí Lễ Gia Tiên Vu Quy Của Chú Rể Thiên Phú  Và Cô Dâu Uyên My" },
  { id:6, image: "img/tva6.jpg", name: "Trang Trí Lễ Gia Tiên Vu Quy Của Chú Rể Thiên Phú  Và Cô Dâu Uyên My" },
  { id:7, image: "img/tva7.jpg", name: "Trang Trí Lễ Gia Tiên Vu Quy Của Chú Rể Thiên Phú  Và Cô Dâu Uyên My" },
  { id:8, image: "img/tva3.jpg", name: "Trang Trí Lễ Gia Tiên Vu Quy Của Chú Rể Thiên Phú  Và Cô Dâu Uyên My" },
  { id:9, image: "img/tva4.jpg", name: "Trang Trí Lễ Gia Tiên Vu Quy Của Chú Rể Thiên Phú  Và Cô Dâu Uyên My" },
];

function ThuVienAnh() {
    return (
        <>
        <div className="flex flex-col mx-5 lg:mx-28 font-timesnewroman py-8 items-center gap-10">
            <h2 className="text-center text-2xl font-bold uppercase">Thư viện ảnh</h2>
            <div className="grid lg:grid-cols-3 gap-5 lg:max-w-[83%] ">
                {items.map((item) => (
                    <Link key={item.id} to="/">
                    <div className="flex flex-col border rounded-2xl border-black">
                        <img src={item.image} className="w-full aspect-[16/9] object-cover rounded-t-2xl"/>
                        <div className="px-5 py-3">
                            <p className="font-bold text-lg">{item.name}</p>
                            <p className="text-red-500 font-bold">Đọc thêm</p>
                        </div>
                    </div>
                </Link>
                ))}
                {/* <Link to="/">
                    <div className="flex flex-col border rounded-2xl border-black">
                        <img src="img/tva1.jpg" className="w-full aspect-[16/9] object-cover rounded-t-2xl"/>
                        <div className="px-5 py-3">
                            <p className="font-bold text-lg">Trang Trí Lễ Gia Tiên Vu Quy Của Chú Rể Thiên Phú  Và Cô Dâu Uyên My</p>
                            <p className="text-red-500 font-bold">Đọc thêm</p>
                        </div>
                    </div>
                </Link> */}
            </div>
        </div>
        </>
    )
}
export default ThuVienAnh;