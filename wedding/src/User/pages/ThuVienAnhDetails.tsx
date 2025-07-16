import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../link";
import { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox"; // cần cài: npm i yet-another-react-lightbox
import "yet-another-react-lightbox/styles.css";

interface Gallery {
  id: number;
  name: string;
  images: string[];
}

function ThuVienAnhDetails() {
  const { id } = useParams();
  const [album, setAlbum] = useState<Gallery | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    getAlbum();
  }, [id]);

  const getAlbum = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/album/getAlbumId?id=${id}`);
      if (response.data.success) {
        setAlbum(response.data.data);
      } else {
        console.error("Không lấy được album:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  return (
    <div className="flex flex-col items-center px-5 lg:px-28 py-10 font-timesnewroman">
      <h1 className="text-3xl font-bold uppercase text-center mb-6">{album?.name}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl w-full">
        {album?.images.map((img, index) => (
          <div
            key={index}
            className="cursor-pointer"
            onClick={() => setOpenIndex(index)}
          >
            <img
              src={img}
              alt={`Ảnh ${index + 1}`}
              className="w-full aspect-[4/3] object-cover rounded-xl shadow-md hover:opacity-90 transition"
            />
          </div>
        ))}
      </div>

      {openIndex !== null && album?.images && (
        <Lightbox
          open
          index={openIndex}
          close={() => setOpenIndex(null)}
          slides={album.images.map((src) => ({ src }))}
          styles={{
            container: {
                backgroundColor: "rgba(0, 0, 0, 0.81)"  // <-- mờ nhẹ hơn
            }
        }}
        />
      )}
    </div>
  );
}

export default ThuVienAnhDetails;
