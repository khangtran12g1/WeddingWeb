import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../link";
import { useEffect, useState } from "react";

interface Gallery {
  id: number;
  name: string;
  images: string[];
}

function ThuVienAnh() {
    const [albums,setAlbums] = useState<Gallery[]>([]);
    useEffect(() => {
          getListAlbums();
        }, []);
    const getListAlbums = async ()=> {
        try {
            const response = await axios.get(`${BASE_URL}/album/getAlbums`);

            if (response.data.success) {
            console.log(response.data.data)
            setAlbums(response.data.data)
            } else {
            console.error('Không lấy được danh sách album:', response.data.message);
            }
        } catch (error) {
            console.error('Lỗi khi gọi API getListAlbums:', error);
        }
    };
    return (
        <>
        <div className="flex flex-col mx-5 lg:mx-28 font-timesnewroman py-8 items-center gap-10">
            <h2 className="text-center text-2xl font-bold uppercase">Thư viện ảnh</h2>
            <div className="grid lg:grid-cols-3 gap-5 lg:max-w-[83%] ">
                {albums.map((album) => (
                    <Link key={album.id} to={`/ThuVienAnhDetails/${album.id}`}>
                    <div className="flex flex-col border rounded-2xl border-black">
                        <img src={album.images[0]} className="w-full aspect-[16/9] object-cover rounded-t-2xl"/>
                        <div className="px-5 py-3">
                            <p className="font-bold text-lg">{album.name}</p>
                            <p className="text-red-500 font-bold">Đọc thêm</p>
                        </div>
                    </div>
                </Link>
                ))}
            </div>
        </div>
        </>
    )
}
export default ThuVienAnh;