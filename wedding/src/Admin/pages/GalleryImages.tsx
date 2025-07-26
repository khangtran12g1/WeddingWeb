import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { BASE_URL } from "../../../link";
import toast from "react-hot-toast";

interface Gallery {
  id: number;
  name: string;
  images: string[];
}
const role = localStorage.getItem("role");
export default function GalleryImages() {
  useEffect(() => {
      getListAlbums();
    }, []);
  const [albums,setAlbums] = useState<Gallery[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files;
    if (f) {
      const fileArray = Array.from(f); // chuyển từ FileList sang File[]
      setFiles(fileArray); 
      const previewUrls = fileArray.map(file => URL.createObjectURL(file));
      setPreviews(previewUrls);
    }else return;
  };
  const addAlbum = async () => {
    if (!name || files.length === 0) {
      alert("Vui lòng nhập tên album và chọn ít nhất một ảnh.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);

    // Thêm từng ảnh vào form
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post(`${BASE_URL}/album/addAlbum`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Thêm album thành công:", response.data);
      toast.success("Thêm album thành công");

      setName("");
      setFiles([]);
      setPreviews([]);
      setOpen(false);
      getListAlbums();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Lỗi khi thêm album:", error.response?.data || error.message);
        alert("Lỗi: " + (error.response?.data?.message || "Không rõ nguyên nhân"));
      } else {
        console.error("Lỗi không xác định:", error);
        alert("Tạo album thất bại.");
      }
    }
  };
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

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedAlbums,setSelectedAlbums] = useState<Gallery | null>(null);
  const [editName,setEditName] = useState("");
  const [editFiles, setEditFiles] = useState<File[]>([]);
  const [editPreviews, setEditPreviews] = useState<string[]>([]);
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files;
    if (f) {
      const fileArray = Array.from(f); // chuyển từ FileList sang File[]
      setEditFiles(fileArray); // set vào state dùng cho sửa
      const previewUrls = fileArray.map(file => URL.createObjectURL(file));
      setEditPreviews(previewUrls); // set ảnh xem trước
    } else return;
  };
  useEffect(() => {
    if (!openEdit || !selectedAlbums) return;
    if (openEdit && selectedAlbums) {
      setEditName(selectedAlbums.name);
      setEditPreviews(selectedAlbums.images);
      setEditFiles([]);
    }
  }, [openEdit, setSelectedAlbums]);
  const updateAlbum = async () => {
    if (!editName || !selectedAlbums) {
      alert("Vui lòng nhập tên album và đảm bảo album đang được chọn.");
      return;
    }

    const formData = new FormData();
    formData.append("id", String(selectedAlbums.id)); 
    formData.append("name", editName);
    editFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
        await axios.post(`${BASE_URL}/album/updateAlbum`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Cập nhật album thành công");
      setEditName("");
      setEditFiles([]);
      setEditPreviews([]);
      setOpenEdit(false);
      setSelectedAlbums(null);
      getListAlbums();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Lỗi khi cập nhật album:", error.response?.data || error.message);
        alert("Lỗi: " + (error.response?.data?.message || "Không rõ nguyên nhân"));
      } else {
        console.error("Lỗi không xác định:", error);
        alert("Cập nhật album thất bại.");
      }
    }
  };


  const deleteAlbum = async (id: number) => {
  const confirm = window.confirm("Bạn có chắc chắn muốn xóa album này?");
  if (!confirm) return;

  try {
    const response = await axios.delete(`${BASE_URL}/album/deleteAlbum/${id}`);

    if (response.data.success) {
      toast.success("Xóa album thành công");
      getListAlbums(); // Refresh danh sách
    } else {
      toast.error(response.data.message || "Xóa album thất bại");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Lỗi khi xóa album:", error.response?.data || error.message);
      alert("Lỗi: " + (error.response?.data?.message || "Không rõ nguyên nhân"));
    } else {
      console.error("Lỗi không xác định:", error);
      alert("Xóa album thất bại.");
    }
  }
};


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-3 text-pink-600">Thư viện ảnh</h1>
      <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Thêm</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-[800px] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thêm</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Nhập tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input type="file" accept="image/*" multiple onChange={handleFileChange} />
            <div className="grid grid-cols-5 gap-2">
            {previews.map((src, index) => (
              
                <img
                  key={index}
                  src={src}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded"
                />
              
            ))}
            </div>
            
            <DialogFooter>
              <Button onClick={() =>addAlbum()}>Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
          <DialogContent className="max-h-[90vh] max-w-[800px] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cập Nhật</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Nhập tên"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <Input type="file" accept="image/*" multiple onChange={handleEditFileChange} />
            <div className="grid grid-cols-5 gap-2">
            {editPreviews.map((src, index) => (
              
                <img
                  key={index}
                  src={src}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded"
                />
              
            ))}
            </div>
            <DialogFooter>
              <Button onClick={() =>updateAlbum()}>Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
        {albums.map((album) => (
          <GalleryCard key={album.id} gallery={album}
          onEdit={() => {
            setSelectedAlbums(album); 
            setOpenEdit(true);      
          }}
          onDelete={()=>{deleteAlbum(album.id)}}/>
        ))}
      </div>
    </div>
  );
}

function GalleryCard({ gallery,onEdit,onDelete }: { gallery: Gallery; onEdit: () => void;onDelete: ()=> void}) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  return (
    <div className="bg-white border rounded-xl shadow-md p-2 space-y-4">
      {/* Ảnh lớn */}
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        loop
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Thumbs]}
        className="rounded overflow-hidden"
      >
        {gallery.images.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img}
              alt={`Ảnh ${index + 1}`}
              className="w-full aspect-[16/8] object-cover rounded"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <h2 className="text-lg font-semibold text-gray-700 ">
        📁 {gallery.name.length > 70 ? gallery.name.slice(0, 70) + "..." : gallery.name}
      </h2>

      {/* Ảnh nhỏ */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={3}
        watchSlidesProgress
        modules={[Thumbs]}
        className="w-full"
      >
        {gallery.images.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img}
              alt={`Thumb ${index + 1}`}
              className="w-full h-24 object-cover rounded cursor-pointer"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Nút sửa xoá */}
      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition text-sm"
          onClick={onEdit}
        >
          ✏️ Sửa
        </button>
        <button
          className={`px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm ${role==="staff" && "hidden"}`}
          onClick={onDelete}
        >
          🗑️ Xoá
        </button>
      </div>
    </div>
  );
}
