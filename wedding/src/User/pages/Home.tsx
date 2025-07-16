import gioithieu from "../image/gioithieu (2).jpg";
import anhgioithieu from "../image/anhgioithieu.png";
import camket from "../image/camket.png";
import shadow from "../image/bg-shadowgt.png";
import {BASE_URL} from "../../../link"
import axios from "axios";

import AOS from "aos";
import "aos/dist/aos.css";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export interface Package {
  id: number;
  subcategory_id : number;
  name: string;
  description: string;
}

export interface SubCategory {
  id: number;
  category_id: number;
  name: string;
  description: string;
  image: string;
  packages : Package[];
}

export interface CategoryWithSub {
  id: number;
  name: string;
  subcategories: SubCategory[];
}

export interface Gioi_Thieu {
  id: number;
  content: string;
  image_url: string;
}


function Home() {
  useEffect(() => {
    AOS.init({ duration: 2000, once: true });
  }, []);

  const [categoryWithSub, setCategoryWithSub] = useState<CategoryWithSub[]>([]);
  useEffect(() => {
    getListCategorySubcategory();
    fetchAbout();
  }, []);
  const getListCategorySubcategory = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/userHome/getListCategorySubcategory`);
    if (res.data.success) {
      setCategoryWithSub(res.data.data);
      console.log("Danh sách:", res.data.data);
    }
  } catch (err) {
    console.error("Lỗi khi gọi API:", err);
  }
};
  const [gioithieu,setGioiThieu] = useState<Gioi_Thieu | null>(null);
  const fetchAbout = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/homeUser/get`);
        if (res.data.success) {
            setGioiThieu(res.data.data);
        } else {
          console.error(res.data.message || "Không tìm thấy nội dung");
        }
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
      }
    };

  
  return (
    <>
    {/* video */}
      <div className="relative">
        <video
          playsInline
          autoPlay
          loop
          muted
          className="w-full rounded-lg object-cover brightness-50 h-[250px] md:h-[450px] xl:h-[578px]"
          // style={{ height: 578 }}
        >
          <source src="https://phuthewedding.com/wp-content/uploads/2023/05/Untitled-Project.mp4" />
        </video>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-white gap-10">
          <h2 className="mb-2 text-3xl font-bold md:text-4xl">
            CƯỚI HỎI PHU THÊ
          </h2>
          <p className="text-lg font-light md:text-2xl">
            Dịch vụ cưới hỏi trọn gói cao cấp
          </p>
          <p className="text-lg font-light md:text-3xl">
            Chuyên Trang Trí Gia Tiên, Mâm Qủa Cưới Hỏi, Tráp Dạm Ngỏ….
          </p>
        </div>
      </div>

    {/* gioi thieu */}
      <div data-aos="fade-right" data-aos-offset="0" className="flex">
        <img src={gioithieu?.image_url} className="w-1/2 hidden md:block object-cover" />
        <div className="flex-1 bg-[#d8f1f9ee] px-3 pt-3">
          <div className="flex justify-center font-timesnewroman text-2xl font-bold text-red-600">
            GIỚI THIỆU VỀ PHU THUÊ WEDDING
          </div>
          <div className="flex items-center justify-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <img src={anhgioithieu} />
            <div className="flex-grow border-t border-gray-400"></div>
          </div>

          <div className="editor-output-HomeGT" dangerouslySetInnerHTML={{ __html: gioithieu?.content||"" }}>
          </div>
        </div>
      </div>
      <img src={shadow} className="h-14 w-full" />

    {/* san pham */}
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 data-aos="fade-up" className="text-3xl font-bold text-red-600 text-center">
          SẢN PHẨM CỦA PHUTHEWEDDING 2025
        </h2>
        {categoryWithSub.map((cat)=>(
          <>
          <div className="flex flex-col" key={cat.id}>
          <h2 data-aos="fade-up" className="text-center text-3xl font-bold font-timesnewroman py-4">{cat.name}</h2>
          <div className="grid w-11/12 mx-auto grid-cols-1 gap-5 px-10 sm:grid-cols-2 md:grid-cols-3 font-timesnewroman">
          {cat.subcategories.map((sub)=> (
            <Link to={`/DanhSachSanPham?subcategoryId=${sub.id}&categoryId=${cat.id}`}>
              <div data-aos="fade-right" className="flex flex-col items-center justify-center gap-4" key={sub.id}>
                <img className="w-full rounded-full border-4 border-yellow-300" src={sub.image} />
                <h2 className="text-lg font-bold hover:text-red-600"> {sub.name} </h2>
              </div>
             </Link>
          ))}
          </div>
        </div>
        <hr className="my-6 border-t border-gray-300 w-2/3 mx-auto" />
        </>
        ))}
        
      </div>
    {/* vi sao */}
      <div className="mt-5 flex flex-col bg-slate-200 pt-5">
        <h2 className="text-center font-serif text-2xl font-bold text-red-600">
          VÌ SAO NÊN CHỌN CƯỚI HỎI PHU THÊ WEDDING
        </h2>

        <div className="mb-6 flex w-full items-center justify-center gap-5">
          <div className="w-1/12 border-t border-gray-400"></div>
          <img src={anhgioithieu} />
          <div className="w-1/12 border-t border-gray-400"></div>
        </div>

        <div className="mx-auto mb-6 grid w-2/3 grid-cols-1 gap-6 md:grid-cols-2">
          <div data-aos="fade-right" className="flex items-start gap-3">
            <img src={camket} className="h-14 w-14 object-contain" />
            <div className="flex flex-col rounded-3xl border-2 border-red-500 px-4 py-2">
              <h2 className="text-xl font-bold">CHUYÊN NGHIỆP TỪNG KHÂU</h2>
              <p>
                Đội ngũ nhân viên trang trí tay nghề cao, khả năng “biến hóa”
                đỉnh cao, luôn cập nhật những xu hướng trang trí mới nhất sẽ
                giúp cô dâu và chú rể yên tâm.
              </p>
            </div>
          </div>
          <div data-aos="fade-right" className="flex items-start gap-3">
            <img src={camket} className="h-14 w-14 object-contain" />
            <div className="flex flex-col rounded-3xl border-2 border-red-500 px-4 py-2">
              <h2 className="text-xl font-bold">TRANG TRÍ SÁNG TẠO</h2>
              <p>
                Không gian tiệc cưới được thiết kế theo yêu cầu, sáng tạo theo
                phong cách riêng.
              </p>
            </div>
          </div>
          <div data-aos="fade-right" className="flex items-start gap-3">
            <img src={camket} className="h-14 w-14 object-contain" />
            <div className="flex flex-col rounded-3xl border-2 border-red-500 px-4 py-2">
              <h2 className="text-xl font-bold">TẬN TÂM PHỤC VỤ</h2>
              <p>
                Phu Thê Wedding luôn sẵn sàng hỗ trợ khách hàng từ khâu chuẩn bị
                đến ngày diễn ra sự kiện.
              </p>
            </div>
          </div>
          <div data-aos="fade-right" className="flex items-start gap-3">
            <img src={camket} className="h-14 w-14 object-contain" />
            <div className="flex flex-col rounded-3xl border-2 border-red-500 px-4 py-2">
              <h2 className="text-xl font-bold">CHI PHÍ HỢP LÝ</h2>
              <p>
                Gói dịch vụ đa dạng, linh hoạt ngân sách, cam kết minh bạch
                không phát sinh chi phí bất ngờ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
