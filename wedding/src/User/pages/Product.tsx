import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { CiViewList } from "react-icons/ci";
import { FaChevronDown,FaChevronUp } from "react-icons/fa";
import {BASE_URL} from "../../../link"
import axios from "axios";

export interface Product {
  id: number;
  name: string;
  short_description: string;
  full_description: string;
  price: number;
  package_id: number | null;
  subcategory_id: number;
  images: string[]; // mới thêm
}
export interface ProductPackage {
  id: number;
  name: string;
  description : string;
  products: Product[];
}
export interface ProductSubcategoryDetails {
  id: number;
  name: string;
  description: string;
  image: string;
  packages: ProductPackage[];
}


export interface Sub {
  id: number;
  category_id: number;
  name: string;
  description: string;
  image: string;
}

function Products() {

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const subcategoryId = searchParams.get("subcategoryId");
  const [productSubcategoryDetails, setProductSubcategoryDetails] = useState<ProductSubcategoryDetails | null>(null);
  const [subcategories, setSubcategories] = useState<Sub[]>([]);

  const [selectedSubCategory, setSelectedSubCategory] = useState<number>(Number(subcategoryId));
  const [selectedPackage,setSelectedPackage] = useState(0);
  const handleSelect = (number : number) => {
    setSelectedPackage(number);
  };

  useEffect(() => {
  if (categoryId) {
    getSubcategoriesByCategory(categoryId);
  }
}, [categoryId]);

  useEffect(() => {
    if (subcategoryId) {
      setSelectedSubCategory(Number(subcategoryId));
    }
  }, [subcategoryId]);

  useEffect(() => {
    if (selectedSubCategory) {
      getProductSubcategoryDetails(selectedSubCategory.toString());
      searchParams.set("subcategoryId", selectedSubCategory.toString());
      setSearchParams(searchParams); 
      setSelectedPackage(0);
      window.scrollTo({
        top: 0,
        behavior: "smooth", // cuộn mượt
      });
    }
  }, [selectedSubCategory]);

  const getSubcategoriesByCategory = async (categoryId: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/userProduct/subcategory_category/${categoryId}/subcategories`);
      if (res.data.success) {
        setSubcategories(res.data.data);
        console.log("Danh sách subcategory:", res.data.data);
      }
    } catch (err) {
      console.error("Lỗi khi gọi API subcategory:", err);
    }
  };
  const getProductSubcategoryDetails = async (subcategoryId: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/userProduct/product_subcategory/${subcategoryId}/details`);
      if (res.data.success) {
        setProductSubcategoryDetails(res.data.data);
        console.log("Chi tiết sản phẩm subcategory:", res.data.data);
      }
    } catch (err) {
      console.error("Lỗi khi gọi API chi tiết sản phẩm:", err);
    }
  };

  useEffect(() => {
        AOS.init({ duration: 2000});
      }, []);

  const [open, setOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY >= 200) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <>
    <div className="relative">
        <div className={"fixed left-6 z-50 transition-all duration-300 " +(isSticky ? "top-0" : "top-36")}
        >
          <button
            onClick={() => setOpen(!open)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white shadow-lg hover:shadow-xl transition"
          >
            <CiViewList size={24} />
            <span className="text-sm font-medium text-gray-700">Bộ lọc</span>
            {open ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {open && (
          <div className={"fixed left-40 z-50 transition-all animate-fade-in-up bg-white border border-gray-200 rounded-2xl shadow-lg p-5 "
                +( isSticky ? "top-[10px]" : "top-36" )}
          >
            <p className="font-semibold text-gray-700 mb-3">💐 Lọc dịch vụ:</p>
            <div className="space-y-2 text-sm text-gray-700">
              {subcategories.map((item) => (
                <label key={item.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="category"
                    value={item.id}
                    checked={selectedSubCategory===item.id}
                    className="accent-pink-500 w-4 h-4 rounded-sm"
                    onChange={() => setSelectedSubCategory(item.id)}
                  />
                  {item.name}
                </label>
              ))}
            </div>

          </div>
        )}
      </div>

    <div key={selectedSubCategory} className=" hidden lg:flex flex-col font-timesnewroman gap-10 py-8 bg-[#edf8fb]">
            <h2 data-aos="fade-up" className="font-bold text-2xl font-timesnewroman text-center">{productSubcategoryDetails?.name}</h2>
            <p data-aos="fade-up" className="text-center text-lg">Hiểu lần đầu là bỡ ngỡ, Cưới hỏi Phu Thê sẽ sát cánh cùng bạn làm nên lần đầu thật trọn vẹn</p>
            <div className=" grid-cols-2 grid px-28 gap-5 text-lg">
                <p data-aos="fade-left">{productSubcategoryDetails?.description}</p>
                <img data-aos="fade-right" src={productSubcategoryDetails?.image} className="w-full aspect-[16/8]"/>
            </div>
    </div>

      <h4 className="my-6 text-center text-xl font-bold text-red-500">
        {productSubcategoryDetails?.name} Đẹp Chuẩn Lễ – Sang Trọng, Tinh Tế Từng Góc Nhìn
      </h4>

      <div className="flex items-center justify-center gap-2 my-6">
        {productSubcategoryDetails?.packages.map((item)=>(
          <button key={item.id} onClick={()=> handleSelect(item.id)} className={"rounded-full  px-4 py-2 text-sm font-bold " + (selectedPackage === item.id ? "bg-red-500 text-white" : "bg-white hover:text-black text-gray-400 border-gray-400 border")}>
            {item.name}
          </button>
        ))}
       
      </div>
      <h2 className="text-center text-red-500 my-6 text-base"> {productSubcategoryDetails?.packages.find(pkg => pkg.id === selectedPackage)?.description}</h2>
      
      {productSubcategoryDetails?.packages.map((item)=> (
        item.id===selectedPackage && (
          <div key={item.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:px-24 px-5 mb-8 gap-3">
            {item.products.map((product)=>(
              <div className="flex flex-col border-2 border-yellow-200 items-center pb-5 font-timesnewroman" >
              <Link to={`/ChiTietSanPham/${product.id}`} className="w-full aspect-square">
                  <img src={product.images[0]}  className="object-cover w-full h-full"/>
              </Link>
              <p className="text-center mt-3">{product.name}</p>
              <p className="text-center text-red-500 font-bold"> Giá: {product.price} đ</p>
              <div className="w-11/12 border-t border-blue-400 my-3"></div>
              <div className="flex flex-col w-full items-start px-3 editor-output-listProduct gap-3" dangerouslySetInnerHTML={{ __html: product.short_description }}>
              </div>

              <Link to={`/ChiTietSanPham/${product.id}`} className="flex border rounded-lg bg-red-600 p-2 justify-center items-center mt-3">
                  <p className="text-white">Xem chi tiết mẫu</p>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
              </Link>
          </div>
            ))}
          </div>
        )
      ))}        
    </>
  );
}
export default Products;
