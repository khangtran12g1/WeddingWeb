import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";

function Introduce (){
    const editorRef = useRef<any>(null);
        const [savedContent, setSavedContent] = useState("");
        
        const handleSave = () => {
            if (editorRef.current) {
              const content = editorRef.current.getContent();
              setSavedContent(content);
            }
          };
    return (
        <>

        {/* test editor */}
        <div className="flex flex-col lg:mx-28 py-5">
            <div className="flex flex-col editor-output-introduce font-timesnewroman gap-4">
                <h2><strong>Phuthewedding – Dịch Vụ Cưới Hỏi Trọn Gói, Chỉn Chu Từng Khoảnh Khắc</strong></h2>

                <p>
                    Ngày cưới – là ngày thiêng liêng, là cột mốc quan trọng nhất trong hành trình yêu thương của mỗi cặp đôi.
                    Với mong muốn mang đến một lễ cưới trọn vẹn, tinh tế và nhẹ nhàng cho cô dâu – chú rể cùng hai bên gia đình,&nbsp;
                    <strong>Phuthewedding</strong>&nbsp;tự hào là đơn vị&nbsp;
                    <strong>cung cấp dịch vụ cưới hỏi trọn gói</strong>, chuyên nghiệp từ khâu chuẩn bị đến hoàn thiện từng chi tiết.
                </p>

                <p>Chúng tôi không chỉ tổ chức lễ cưới – chúng tôi đồng hành, chăm chút và gói trọn yêu thương trong từng khoảnh khắc.</p>

                <p>Phuthewedding chuyên cung cấp dịch vụ cưới hỏi trọn gói tại TP.HCM, sẵn sàng phục vụ tất cả các quận như: Quận 1, Quận 3, Quận 5, Quận 7, Quận 10, Bình Thạnh, Gò Vấp, Tân Bình, Tân Phú, Phú Nhuận, Thủ Đức, Bình Tân, Hóc Môn, Nhà Bè, Quận 12, và các khu vực lân cận.</p>

                <p>Dù bạn ở trung tâm hay vùng ven, đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ tận nơi, đảm bảo uy tín – chuyên nghiệp – đúng giờ.</p>

                <h3><strong>Dịch vụ cưới hỏi trọn gói tại Phuthewedding gồm:</strong></h3>

                <h3><span role="img" aria-label="🔸">🔸</span>&nbsp;<strong>Mâm quả cưới hỏi:</strong></h3>
                <p>Thiết kế mâm quả truyền thống & hiện đại, đa dạng mẫu mã, trang trí chỉn chu theo yêu cầu. Các mẫu mâm quả long phụng, mâm bánh, mâm trà rượu, cau trầu… đều được sắp xếp tinh tế, tượng trưng cho sự sung túc và vẹn toàn.</p>

                <h3><span role="img" aria-label="🔸">🔸</span>&nbsp;<strong>Trang trí gia tiên:</strong></h3>
                <p>Không gian gia tiên được bày trí trang trọng, ấm cúng với hoa tươi, phông nền, bàn thờ gia tiên, vật phẩm truyền thống… đảm bảo yếu tố thẩm mỹ và nghi lễ chuẩn mực.</p>

                <h3><span role="img" aria-label="🔸">🔸</span>&nbsp;<strong>Lễ vật dạm ngõ:</strong></h3>
                <p>Chuẩn bị trọn bộ lễ vật dạm ngõ đầy đủ – gọn gàng, chỉn chu và đúng lễ nghi từng vùng miền. Từ bánh trái, trà rượu, trầu cau đến mâm hoa quả tượng trưng cho thành ý và lòng kính trọng.</p>

                <h3><span role="img" aria-label="🔸">🔸</span>&nbsp;<strong>Cổng hoa – backdrop:</strong></h3>
                <p>Thiết kế cổng hoa hiện đại, cổng hoa tươi, hoa lụa hoặc cổng cưới theo chủ đề, tone màu – là điểm nhấn hoàn hảo cho không gian đón khách.</p>

                <h3><span role="img" aria-label="🔸">🔸</span>&nbsp;<strong>Nhân sự bê quả:</strong></h3>
                <p>Cung cấp đội hình bê quả nam – nữ thanh lịch, đồng phục chỉnh tề, hỗ trợ chuyên nghiệp trong lễ rước dâu.</p>

                <h3><span role="img" aria-label="🔸">🔸</span>&nbsp;<strong>Xe hoa – xe đưa đón:</strong></h3>
                <p>Dịch vụ xe hoa cưới sang trọng, trang trí theo phong cách riêng, đúng giờ – đúng lễ – đúng gu.</p>

                <h3><span role="img" aria-label="🔸">🔸</span>&nbsp;<strong>Rồng phụng trang trí:</strong></h3>
                <p>Tạo hình rồng phụng từ trái cây, bánh phu thê hoặc trang trí bàn thờ gia tiên – biểu tượng hạnh phúc viên mãn, phú quý dài lâu.</p>

                <h3><strong>Vì sao chọn Phuthewedding?</strong></h3>

                <h3><span role="img" aria-label="✅">✅</span>&nbsp;<strong>Chỉn chu – Đúng lễ – Tinh tế từng chi tiết</strong></h3>
                <h3><span role="img" aria-label="✅">✅</span>&nbsp;<strong>Tư vấn tận tâm – Thiết kế theo phong cách riêng của bạn</strong></h3>
                <h3><span role="img" aria-label="✅">✅</span>&nbsp;<strong>Tiết kiệm thời gian – Không lo thiếu sót</strong></h3>
                <h3><span role="img" aria-label="✅">✅</span>&nbsp;<strong>Kinh nghiệm tổ chức hàng trăm lễ cưới mỗi năm</strong></h3>

                <h3><strong>Phuthewedding – Không chỉ là một dịch vụ, mà là người bạn đồng hành trọn vẹn trong ngày trọng đại của bạn.</strong></h3>

                <h4>Liên hệ với chúng tôi để được tư vấn miễn phí & đặt lịch:</h4>
                <h4><span role="img" aria-label="📞">📞</span>&nbsp; 090 664 66 92</h4>
                <h4><span role="img" aria-label="📍">📍</span>&nbsp;756 Nguyễn Đình Chiểu – P.1 – Q.3 – TP. Hồ Chí Minh</h4>
                <h4><span role="img" aria-label="🌐">🌐</span>&nbsp;<a href="https://phuthewedding.com/">https://phuthewedding.com/</a></h4>
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