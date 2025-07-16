
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef } from "react";
import {BASE_URL} from "../../../link"
import axios from "axios";
import { toast } from "react-hot-toast";


export default function About(){
    const editAbout = useRef<any>(null);
    const handleSave = async () => {
        const content = editAbout.current?.getContent();
        if (!content) {
        toast.error("Nội dung không được để trống");
        return;
        }

        try {
        const res = await axios.post(`${BASE_URL}/About/save`, { content }); // đổi BASE_URL nếu cần
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
    useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/about/get`);
        if (res.data.success) {
            const aboutContent = res.data.data.content;
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

    fetchAbout();
  }, []);

    return(
        <>
              <div className="flex-1">
                <Label className="mb-2">Giới Thiệu</Label>
                <Editor
                    apiKey="e84evq5hbqp4fw63bd77vkvip4r1ueoo7rjbv6nv59hdq8k4"
                    onInit={(_, editor) => (editAbout.current = editor)}
                    init={{
                    height: 530,
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