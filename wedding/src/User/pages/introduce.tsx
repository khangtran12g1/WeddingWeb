import axios from "axios";
import { BASE_URL } from "../../../link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function Introduce (){
    const [content,setContent] = useState("");
    useEffect(() => {
        const fetchAbout = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/about/get`);
            if (res.data.success) {
                const aboutContent = res.data.data.content;
                setTimeout(() => {
                    setContent(aboutContent || "");
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
    return (
        <>

        {/* test editor */}
        <div className="flex flex-col lg:mx-28 py-5">
            <div className="flex flex-col editor-output-introduce font-timesnewroman gap-4" dangerouslySetInnerHTML={{ __html: content }}>
        </div>

        {/* <div className="flex flex-col editor-output-introduce font-timesnewroman gap-4" dangerouslySetInnerHTML={{ __html: savedContent }}>
        </div> */}
        </div>
        {/* <div className="max-w-4xl">
        <Editor
        apiKey="h7e10mq3w5ylwea2i2cwdefnjksknfi86dccadw99t4qg3bo"
        onInit={(_, editor) => (editorRef.current = editor)}
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
            <button
                onClick={handleSave}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
            Lưu nội dung
        </button>
        </div> */}
        </>
    )
}
export default Introduce;