import cnhu from "../image/cnhu.jpg";
import atrieu from "../image/atrieu.jpg";
import { useCart } from "../components/CartContext";


import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, FreeMode, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import 'swiper/css/navigation'

import { useEffect} from "react";
import {BASE_URL} from "../../../link"
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import toast from "react-hot-toast";

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
}

export interface ProductDetail {
  id: number;
  subcategory_id: number;
  subcategory_name: string;
  category_id: number;
  category_name: string;
  package_id: number;
  name: string;
  short_description: string;
  full_description: string;
  price: number;
  type: string;
  images: ProductImage[];
}

function ProductDetail() {
//{ them vao gio hang
    const { addToCart } = useCart();
    
    const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
    const { id } = useParams();
    const getProductDetailById = async (id: string): Promise<ProductDetail | null> => {
        try {
            const res = await axios.get(`${BASE_URL}/userProductDetail/productDetail/${id}/details`);
            if (res.data.success) {
            setProductDetail(res.data.data);
            }
            return null;
        } catch (err) {
            console.error("Lỗi khi gọi API chi tiết sản phẩm:", err);
            return null;
        }
    };
    useEffect(() => {
        if (id) {
            getProductDetailById(id);
        }
    }, [id]);


    const [phone, setPhone] = useState("");
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [quantity, setQuantity] = useState(1);

    const increase = () => setQuantity((q) => q + 1);
    const decrease = () => setQuantity((q) => Math.max(1, q - 1));



    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${BASE_URL}/lienHe/send`, { name: "Không", phone: phone, message: "Yêu cầu gọi lại" });

            if (res.status === 200) {
            toast.success("Gửi thành công");
            setPhone("");
            }
        } catch (error) {
            console.error("Lỗi gửi liên hệ:", error);
            toast.error("Gửi không thành công");
        }
    };

    const colors = [
        { name: "Màu Đỏ", class: "bg-red-500" },
        { name: "Màu Xanh Dương", class: "bg-blue-500" },
        { name: "Màu Xanh Lá", class: "bg-green-500" },
        { name: "Màu Vàng", class: "bg-yellow-400" },
        { name: "Màu Tím", class: "bg-purple-500" },
        { name: "Màu Cam", class: "bg-orange-500" },
        { name: "Màu Hồng", class: "bg-pink-400" },
        { name: "Màu Xám", class: "bg-gray-500" },
    ];

  return (
    <>
      <div className="my-8 bg-white md:mx-24">
        <div className="flex gap-2 [&>h2]:text-gray-400 [&>h2]:text-lg mb-4 px-4" >
          <h2>TRANG CHỦ</h2>
          <h2>/</h2>
          <h2>{productDetail?.subcategory_name}</h2>
        </div>
        <div className="md: grid grid-cols-1 md:grid-cols-2">
        {/* Phần ảnh */}
          <div className="px-4 md:sticky top-20 h-fit gap-4">
            <Swiper
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                watchSlidesProgress={true} // QUAN TRỌNG
                modules={[Navigation, Thumbs]}
                className="mb-4"
            >
                {productDetail?.images.map((img) => (
                <SwiperSlide key={img.id}>
                    <div className="w-full aspect-[16/11]">
                        <img src={img.image_url} alt={`img-${img.id}`} className="w-full h-full object-cover" />
                    </div>
                </SwiperSlide>
                ))}
            </Swiper>
            
                <div className="thumbs-swiper">
                    <Swiper
                        onSwiper={setThumbsSwiper}
                        spaceBetween={10}
                        slidesPerView="auto"
                        freeMode={true}
                        watchSlidesProgress={true}
                        slideToClickedSlide={true} 
                        modules={[FreeMode, Thumbs]}
                    >
                        {productDetail?.images.map((img) => (
                        <SwiperSlide key={img.id} className="!w-[100px]">
                            <img src={img.image_url} alt={`thumb-${img.id}`} className="cursor-pointer aspect-video object-cover" />
                        </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
            {/* Bên phải phần ảnh */}
          <div className="px-4 flex flex-col gap-4">
            <h2 className="xl:text-3xl text-xl font-medium">{productDetail?.name}</h2>
            <div className="flex xl:text-2xl text-lg font-medium">
                <h2 >Giá:&nbsp;</h2>
                <h2 className=" text-red-600">{productDetail?.price} đ</h2>
            </div>
            {productDetail?.category_name==="Dịch Vụ Cưới Hỏi" &&
            <div className="flex flex-col [&>h2]:text-lg font-medium gap-3">
                <h2>CÁC TONE MÀU HIỆN CÓ:</h2>
                <div className="grid grid-cols-8 sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-8 xl:grid-cols-8 gap-4">
  {colors.map((color, index) => (
    <div
      key={index}
      className="flex flex-col items-center border rounded p-2"
    >
      <div className={`${color.class} w-full aspect-square rounded`}></div>
      <p className="text-xs text-center mt-2">{color.name}</p>
    </div>
  ))}
</div>

            </div>

            }
            <div className="flex flex-col editor-output-category font-timesnewroman gap-4" 
                dangerouslySetInnerHTML={{ __html: productDetail?.short_description ||"" }}>
            </div>
            {/* <div className="flex flex-col [&>h2]:text-lg font-medium gap-3">
                <h2>DANH MỤC BAO GỒM:</h2>
                <ul className="list-decimal list-inside space-y-1 text-gray-700 text-lg font-timesnewroman">
                    <li>Trang trí cổng hoa lụa cao cấp</li>
                    <li>Trang trí phong màn voan + hoa lụa + chữ hỷ</li>
                    <li>Trang trí bàn thờ gia tiên + bộ lư đồng</li>
                    <li>Trang trí bàn để mâm quả</li>
                    <li>Trang trí bàn 2 họ + 12 ghế tiffany</li>
                    <li>Trang trí 2 bộ ấm tách trà</li>
                    <li>Trang trí 2 hoa lụa để bàn họ</li>
                    <li>Thiết kế bảng tên cô dâu và chú rể</li>
                </ul>
            </div>
            <hr/>
            <div className="flex flex-col [&>h2]:text-lg font-medium gap-3 ">
                <h2>HỖ TRỢ THÊM:</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-lg font-timesnewroman" >
                    <li><span className="text-red-500">Tặng:&nbsp;</span>12 chai nước suối in tên</li>
                    <li><span className="text-red-500">Tặng:&nbsp;</span>10 bông cài áo</li>
                    <li><span className="text-red-500">Tặng:&nbsp;</span>2 đĩa 3 tần cao cấp</li>
                </ul>
            </div> */}
            <hr/>
            <p className="text-lg font-timesnewroman">Hãy để Cưới Hỏi Phu Thê có cơ hội được phục vụ bạn</p>
            <div className="flex items-center gap-7">
                <img src={cnhu} className="w-16 h-auto"/>
                <div className="flex flex-col">
                    <p className="font-bold">C.Vôn</p>
                    <p className="flex items-center">
                        <a>📞0967784511</a>
                        &nbsp;-&nbsp;
                        <a target="_blank" href="" className="flex"><img className="w-6" src="https://phuthewedding.com/wp-content/uploads/2023/03/icon-zalo-circle2.png.pagespeed.ce_.iUc59tfITH.png"/>Zalo</a>
                        &nbsp;-&nbsp;
                        <a target="_blank" href="" className="flex"><img className="w-6" src="https://phuthewedding.com/wp-content/uploads/2023/03/icon-messenger.png.pagespeed.ce_.sSebhnGGgP.png"/>FaceBook</a>
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-7">
                <img src={atrieu} className="w-16 h-auto"/>
                <div className="flex flex-col">
                    <p className="font-bold">A.Khang</p>
                    <p className="flex items-center">
                        <a href="">📞0967784511</a>
                        &nbsp;-&nbsp;
                        <a target="_blank" href="" className="flex"><img className="w-6" src="https://phuthewedding.com/wp-content/uploads/2023/03/icon-zalo-circle2.png.pagespeed.ce_.iUc59tfITH.png"/>Zalo</a>
                        &nbsp;-&nbsp;
                        <a target="_blank" href="https://www.facebook.com/tran.an.khang.993446/?locale=vi_VN" className="flex"><img className="w-6" src="https://phuthewedding.com/wp-content/uploads/2023/03/icon-messenger.png.pagespeed.ce_.sSebhnGGgP.png"/>FaceBook</a>
                    </p>
                </div>
            </div>
            <div className="flex flex-col p-6 bg-blue-400 md:w-2/3 gap-4 rounded-xl">
                <p className="text-white font-timesnewroman text-center text-lg">Yêu cầu Phuthewedding gọi lại</p>
                <div className="flex gap-3">
                    <input className="border rounded-lg text-base focus:outline-none p-2"
                        value={phone}
                        onChange={(values) => setPhone(values.target.value)}
                        placeholder="Số điện thoại cần tư vấn"
                        />
                    <button className="text-white hover:text-black" onClick={ handleSubmit}>Gửi</button>
                </div>
            </div>
            <div className="flex items-center">
                <button
                    onClick={decrease}
                    className="w-10 h-10 rounded bg-gray-200 text-xl hover:bg-gray-300"> – </button>

                <input
                    type="number" value={quantity} readOnly
                    className="w-16 h-10 text-center border border-gray-300 rounded"
                />

                <button
                    onClick={increase}
                    className="w-10 h-10 rounded bg-gray-200 text-xl hover:bg-gray-300"> + </button>

                <button onClick={()=>addToCart({
                    id: productDetail?.id ?? 0,
                    name: productDetail?.name ?? "Không tên",
                    price: productDetail?.price ?? 0,
                    img: productDetail?.images?.[0].image_url ?? "",
                    quantity:quantity
                })}
                    className="flex items-center gap-2 py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 ml-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13L5.4 5M16 21a1 1 0 100-2 1 1 0 000 2zm-8 0a1 1 0 100-2 1 1 0 000 2z" />
                    </svg>
                    Thêm vào giỏ
                </button>

                <button
                    onClick={()=>addToCart({
                        id: productDetail?.id ?? 0,
                        name: productDetail?.name ?? "Không tên",
                        price: productDetail?.price ?? 0,
                        img: productDetail?.images?.[0].image_url ?? "",
                        quantity:quantity
                    })}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-700 ml-4"
                    >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-6 h-6 text-white fill-current"
                        >
                        <path d="M13 2L3 14h7v8l10-12h-7z" />
                    </svg>
                    <Link to={"/Order"}>
                    Đặt ngay
                    </Link>
                </button>

            </div>
          </div>
          
        </div>

        <div className="border-gray-300 w-full border-b px-4 py-4"></div>
        {/* Mô tả */}
        <div className="flex flex-col gap-4 font-timesnewroman [&>p]:text-lg">
            <div className="inline-flex w-fit items-center gap-3 px-4 py-2 font-timesnewroman text-2xl text-red-500 border rounded-md font-bold mt-5">
                MÔ TẢ
                <svg
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 16h8M8 12h8m-8-4h8M4 6h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
                    />
                </svg>
            </div>
            <div className="flex flex-col editor-output-describe font-timesnewroman gap-4" 
                dangerouslySetInnerHTML={{ __html: productDetail?.full_description ||"" }}>
            </div>
            {/* <h2 className="text-[1.6em] flex items-center font-bold gap-2">
                <img draggable="false" className="w-[1em] h-[1em]" src="https://s.w.org/images/core/emoji/15.1.0/svg/1f4cc.svg"/>
                Dịch Vụ Trang Trí Gia Tiên Đám Cưới Tại Nhà – Phu Thê Wedding
            </h2>
            <p><strong>Trang trí gia tiên đám cưới </strong>là nghi thức quan trọng, không thể thiếu trong mỗi lễ cưới – lễ hỏi của người Việt. Đây là nơi bày tỏ lòng thành kính với tổ tiên và là không gian chứng kiến những nghi thức thiêng liêng của cô dâu – chú rể.</p>
            <p><strong>Phu Thê Wedding</strong> mang đến dịch vụ <strong>trang trí gia tiên</strong> tại nhà trọn gói, thiết kế sang trọng, trang nhã và đúng chuẩn phong tục truyền thống.</p>
            <hr></hr>
            <h2 className="text-[1.6em] flex items-center font-bold gap-2">
                <img draggable="false" className="w-[1em] h-[1em]" src="https://s.w.org/images/core/emoji/15.1.0/svg/1f380.svg"/>
                Hạng Mục Trang Trí Gia Tiên Bao Gồm:
            </h2>
            <ol className="list-decimal ml-[1.3em] text-lg [&>li]:mb-4">
                <li><p>Phong màn voan vải lụa cao cấp, trang trí chữ Hỷ và hoa lụa.</p></li>
                <li><p>Bàn thờ gia tiên phủ vải ren đẹp, trang trí bộ lư đồng (gồm bộ đỉnh, hai chân đèn và bát nhang)..</p></li>
                <li><p>Bàn để mâm quả phủ ren đồng bộ, bày được 6 quả theo đúng nghi lễ.</p></li>
                <li><p>Bàn tiếp hai họ dài 2m4, phủ vải ren cao cấp, sắp xếp 12 ghế (mỗi bên 6 ghế).</p></li>
                <li><p>Bộ ấm trà gồm 2 bình, 12 tách và 14 đĩa nhỏ dùng trong nghi lễ mời trầu – mời nước.</p></li>
                <li><p>Hai bình hoa lụa cao cấp, phối màu theo tông chủ đạo hoặc theo ý thích.</p></li>
                <li><p>Bảng tên cô dâu – chú rể in trên bảng cứng đẹp mắt, đặt tại khu vực bàn thờ hoặc cổng hoa.</p></li>
                <li><p>Cổng hoa lụa cao cấp, treo bảng chữ “Tân Hôn” hoặc “Vu Quy”.</p></li>
            </ol>
            <hr/>
            <h2 className="text-[1.6em] flex items-center font-bold gap-2">
                <img draggable="false" className="w-[1em] h-[1em]" src="https://s.w.org/images/core/emoji/15.1.0/svg/1f381.svg"/>
                Hỗ Trợ & Khuyến Mãi Kèm Theo:
            </h2>
            <ul className="list-disc text-lg font-timesnewroman ml-[1.3em] [&>li]:mb-4">
                <li><p>2 kệ 3 tầng bày lễ vật hoặc bánh trái.</p></li>
                <li><p>Đèn nháy trang trí cho không gian thêm lung linh.</p></li>
                <li><p>12 chai nước suối in tên cô dâu – chú rể tặng khách.</p></li>
                <li><p>12 hoa cài áo cho họ hàng hai bên.</p></li>
            </ul>
            <hr/>
            <h2 className="text-[1.6em] flex items-center font-bold gap-2">
                <img draggable="false" className="w-[1em] h-[1em]" src="https://s.w.org/images/core/emoji/15.1.0/svg/2728.svg"/>
                Hạng Mục Trang Trí Gia Tiên Bao Gồm:
            </h2>
            <p>Ngoài gói cơ bản, Phu Thê Wedding nhận thiết kế theo ý tưởng hoặc mẫu có sẵn của khách:</p>
            <ul className="list-disc text-lg font-timesnewroman ml-[1.3em] [&>li]:mb-4">
                <li><p>Thay đổi màu sắc, kiểu dáng cổng hoa, bàn thờ.</p></li>
                <li><p>Trang trí thêm rạp cưới, sân khấu, bàn gallery, cầu thang, lối đi.</p></li>
                <li><p>Nhận thi công trọn gói tại nhà đúng chuẩn lễ nghi truyền thống.</p></li>
            </ul> */}
            <p><img className="w-[1em] h-[1em] float-left mr-1 mt-1" src="https://s.w.org/images/core/emoji/15.1.0/svg/1f699.svg"/> Chúng tôi chuyên cung cấp dịch vụ cưới hỏi trọn gói tại TP.HCM, sẵn sàng phục vụ tất cả các quận như: Quận 1, Quận 3, Quận 5, Quận 7, Quận 10, Bình Thạnh, Gò Vấp, Tân Bình, Tân Phú, Phú Nhuận, Thủ Đức, Bình Tân, Hóc Môn, Nhà Bè, Quận 12, và các khu vực lân cận.</p>
            <p>Dù bạn ở trung tâm hay vùng ven, đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ tận nơi, đảm bảo uy tín – chuyên nghiệp – đúng giờ.</p>
        </div>
        
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold font-timesnewroman m-5">Hình ảnh thực tế tại Phuthewedding</h2>
             {productDetail?.images.map((image)=>(
                <div key={image.id} className="w-full h-full  aspect-[16/9] my-3 xl:w-9/12 ">
                    <img src={image.image_url} alt={`img ${image.id}`} className=" w-full h-full object-cover border rounded-3xl"/>
                </div>
             ))}              
        </div>
        

      </div>
      
    </>
  );
}
export default ProductDetail;
