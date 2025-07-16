
import { Button } from "@/components/ui/button";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState } from "react";
import {BASE_URL} from "../../../link"
import axios from "axios";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";

export interface Gioi_Thieu {
  id: number;
  content: string;
  image_url: string;
}


export default function HomeGioiThieu(){
    const editAbout = useRef<any>(null);
    const [gioithieu,setGioiThieu] = useState<Gioi_Thieu | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handleSave = async () => {
        const content = editAbout.current?.getContent();
        if (!content) {
        toast.error("Nội dung không được để trống");
        return;
        }

        try {
        const res = await axios.post(`${BASE_URL}/homeUser/save`, { content }); // đổi BASE_URL nếu cần
        if (res.data.success) {
            toast.success("Lưu thành công!");
        } else {
            toast.error(res.data.message || "Có lỗi xảy ra");
        }
        } catch (err) {
        console.error("Lỗi khi lưu:", err);
        toast.error("Lỗi máy chủ");
        }
    };
    const fetchAbout = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/homeUser/get`);
        if (res.data.success) {
            const aboutContent = res.data.data.content;
            setGioiThieu(res.data.data);
            setTimeout(() => {
                editAbout.current?.setContent(aboutContent || "");
            }, 1000);
        } else {
          toast.error(res.data.message || "Không tìm thấy nội dung");
        }
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        toast.error("Lỗi máy chủ");
      }
    };
    useEffect(() => {
    fetchAbout();
  }, []);

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
        console.log("File đã chọn:", selectedFile);
      }
    };

    const updateImage = async () => {
    if (!file || file === null) {
      alert("Vui lòng chọn một ảnh để cập nhật.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.post(`${BASE_URL}/homeUser/setImage`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Cập nhật ảnh giới thiệu thành công");
      setFile(null);
      fetchAbout();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Lỗi khi cập nhật ảnh:", error.response?.data || error.message);
        alert("Lỗi: " + (error.response?.data?.message || "Không rõ nguyên nhân"));
      } else {
        console.error("Lỗi không xác định:", error);
        alert("Cập nhật ảnh thất bại.");
      }
    }
  };


    return(
        <>
              <div className="flex-1">
                <div className="flex mb-5 gap-4 items-center">
                  <Button variant={"destructive"} onClick={handleButtonClick}> Chọn Ảnh</Button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {file && (<><p className="mt-2 text-sm">Đã chọn: {file.name}</p> 
                    <Button variant={"destructive"} onClick={()=> updateImage()}> Lưu</Button></>
                  )}
                  <Button variant={"destructive"} onClick={()=> setOpenDialog(!openDialog)} > Xem Ảnh</Button>
                </div>
                <Editor
                    apiKey="e84evq5hbqp4fw63bd77vkvip4r1ueoo7rjbv6nv59hdq8k4"
                    onInit={(_, editor) => (editAbout.current = editor)}
                    init={{
                    height: 500,
                    plugins: [
                        // Core plugins
                        "anchor", "autolink", "charmap", "codesample", "emoticons", "image", "link", "lists", "media", "searchreplace", "table", "visualblocks", "wordcount",
                        "checklist", "mediaembed", "casechange", "formatpainter", "pageembed", "a11ychecker", "tinymcespellchecker", "permanentpen", "powerpaste", "advtable", "advcode", "editimage", "advtemplate", "mentions", "tinycomments", "tableofcontents", "footnotes", "mergetags", "autocorrect", "typography", "inlinecss", "markdown", "importword", "exportword", "exportpdf"
                    ],
                    toolbar:
                        "undo redo | blocks fontfamily fontsize | bold italic underline emoticons numlist bullist image hr| link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | indent outdent | charmap | removeformat",
                    tinycomments_mode: "embedded",
                    tinycomments_author: "Author name",
                    mergetags_list: [
                        { value: "First.Name", title: "First Name" },
                        { value: "Email", title: "Email" },
                        ],
                        }}
                />
                <div className="mt-2 w-full flex justify-end">
                    <Button onClick={handleSave} variant={"destructive"}>
                        Lưu
                    </Button>
                </div>
                <Dialog open={openDialog} onOpenChange={setOpenDialog} >
                  <DialogContent>
                    <img src={gioithieu?.image_url}/>
                    <DialogFooter>
                      <Button onClick={()=> setOpenDialog(false)}>Đóng</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
              </div>
        </>
    )
}