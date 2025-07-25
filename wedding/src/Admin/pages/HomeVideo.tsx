
import { Button } from "@/components/ui/button";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState } from "react";
import {BASE_URL} from "../../../link"
import axios from "axios";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface Video {
  id: number;
  mo_ta: string;
  video_url: string;
}


export default function HomeVideo(){
    const editMota = useRef<any>(null);
    const [link,setLink] = useState("");
    const handleSave = async () => {
        const content = editMota.current?.getContent();
        if (!content) {
            toast.error("Nội dung không được để trống");
            return;
        }

        try {
        const res = await axios.post(`${BASE_URL}/homeUser/saveVideoContent`, { content }); // đổi BASE_URL nếu cần
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
    const handleSaveVideo = async () => {
        if (!link) {
            toast.error("Nội dung không được để trống");
            return;
        }

        try {
        const res = await axios.post(`${BASE_URL}/homeUser/saveVideoUrl`, { link }); // đổi BASE_URL nếu cần
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
        const res = await axios.get(`${BASE_URL}/homeUser/getVideo`);
        if (res.data.success) {
            const aboutContent = res.data.data.mo_ta;
            setLink(res.data.data.video_url)
            setTimeout(() => {
                editMota.current?.setContent(aboutContent || "");
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

    return(
        <>
              <div className="flex-1">
                <div className="flex mb-5 gap-4 items-center">
                    <Label htmlFor="link">Link</Label>
                    <Input
                        className="w-[400px]"
                        id="link"
                        type="text"
                        value={link}
                        onChange={(e)=>setLink(e.target.value)}
                        placeholder="Nhập link video..."
                    />
                   <Button variant={"destructive"} onClick={()=> handleSaveVideo()}> Lưu</Button>
                </div>
                <Editor
                    apiKey="mia9v15z0haplqqr2z5sfs498n4cbsd580bgnagfnpaayby0"
                    onInit={(_, editor) => (editMota.current = editor)}
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
                
              </div>
        </>
    )
}