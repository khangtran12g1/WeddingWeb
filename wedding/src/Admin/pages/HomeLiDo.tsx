import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../link";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import camket from "../../User/image/camket.png";

export interface LiDo {
  id: number;
  title: string;
  content: string;
  image_url: string;
}

export default function HomeLiDo() {
  const [liDoList, setLiDoList] = useState<LiDo[]>([]);
    const [selectedItem, setSelectedItem] = useState<LiDo | null>(null);


    const [openDialogAdd, setOpenDialogAdd] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const handleSubmit = async () => {
        if (!title || !content) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            if (image) {
                formData.append("image", image);
            }

            const res = await axios.post(`${BASE_URL}/homeUser/saveLido`, formData);
            if (res.status === 200) {
              toast.success(res.data.message || "Thêm lý do thành công!");
              setOpenDialogAdd(false);
              setTitle("");
              setContent("");
              setImage(null);
              fetchLiDo();
            } else {
              toast.error("Thêm lý do thất bại!");
            }
        } catch (err) {
            toast.error("Lỗi khi thêm lý do");
        }
    };


  const fetchLiDo = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/homeUser/getLido`);
      setLiDoList(res.data);
    } catch (err) {
      toast.error("Lỗi tải danh sách lý do");
    }
  };

  useEffect(() => {
    fetchLiDo();
  }, []);

    const [openDialogEdit, setOpenDialogEdit] = useState(false);
    const [titleEdit, setTitleEdit] = useState("");
    const [contentEdit, setContentEdit] = useState("");
    const [imageEdit, setImageEdit] = useState<File | null>(null);
    const handleEdit = (item: LiDo) => {
        setSelectedItem(item);
        setTitleEdit(item.title);
        setContentEdit(item.content);
        setImageEdit(null); // Cho phép chọn ảnh mới nếu cần
        setOpenDialogEdit(true); // 👉 Mở dialog sửa
    };
    const handleUpdate = async () => {
        if (!selectedItem) return;
        if (!titleEdit || !contentEdit) {
            toast.error("Vui lòng nhập đầy đủ tiêu đề và mô tả!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", titleEdit);
            formData.append("content", contentEdit);
            if (imageEdit) {
            formData.append("image", imageEdit);
            }

            await axios.put(`${BASE_URL}/homeUser/updateLido/${selectedItem.id}`, formData);
            toast.success("Cập nhật lý do thành công!");
            setOpenDialogEdit(false);
            fetchLiDo();
        } catch (err) {
            toast.error("Lỗi khi cập nhật lý do");
        }
    };


    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc muốn xoá lý do này?")) return;

        try {
            await axios.delete(`${BASE_URL}/homeUser/deleteLido/${id}`);
            toast.success("Đã xoá lý do");
            fetchLiDo(); // reload danh sách
        } catch (err) {
            toast.error("Lỗi khi xoá lý do");
        }
    };


  return (
    <>
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Danh sách lý do</h1>
          <Button onClick={() => setOpenDialogAdd(true)}>Thêm lý do</Button>
        </div>

        {/* Danh sách lý do */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {liDoList.map((item) => (
            <div
                key={item.id}
                className="flex flex-col justify-between border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
                >
                <div className="flex items-start gap-3">
                    <img
                    src={item.image_url ? item.image_url : camket}
                    alt="icon"
                    className="w-12 h-12 object-contain flex-shrink-0"
                    />
                    <div className="flex flex-col">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">
                        {item.title}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-3">{item.content}</p>
                    </div>
                </div>

                {/* Nút Sửa và Xoá */}
                <div className="mt-4 flex justify-end gap-2">
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
                    >
                    Sửa
                    </Button>
                    <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    >
                    Xoá
                    </Button>
                </div>
                </div>

          ))}
        </div>
      </div>

      {/* Dialog thêm lý do (chưa xử lý form) */}
      <Dialog open={openDialogAdd} onOpenChange={setOpenDialogAdd}>
        <DialogContent>
            <h2 className="text-xl font-semibold mb-4">Thêm lý do</h2>

            <div className="space-y-4">
            {/* Tiêu đề */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề
                </label>
                <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
                />
            </div>

            {/* Mô tả */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
                </label>
                <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full border rounded px-3 py-2 text-sm resize-none"
                />
            </div>

            {/* Ảnh */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Chọn ảnh
                </label>
                <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full"
                />
            </div>
            </div>

            <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpenDialogAdd(false)}>
                Đóng
            </Button>
            <Button onClick={handleSubmit}>Lưu</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    <Dialog open={openDialogEdit} onOpenChange={setOpenDialogEdit}>
        <DialogContent>
            <h2 className="text-xl font-semibold mb-4">Chỉnh sửa lý do</h2>

            <div className="space-y-4">
            {/* Tiêu đề */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                <input
                type="text"
                value={titleEdit}
                onChange={(e) => setTitleEdit(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
                />
            </div>

            {/* Mô tả */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                value={contentEdit}
                onChange={(e) => setContentEdit(e.target.value)}
                rows={4}
                className="w-full border rounded px-3 py-2 text-sm resize-none"
                />
            </div>

            {/* Ảnh mới (nếu cần) */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chọn ảnh mới (nếu muốn thay)</label>
                <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageEdit(e.target.files?.[0] || null)}
                />
            </div>
            </div>

            <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpenDialogEdit(false)}>Đóng</Button>
            <Button onClick={handleUpdate}>Cập nhật</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>


    </>
  );
}
