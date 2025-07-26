import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import {BASE_URL} from "../../../link"
import axios from 'axios';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useRef} from "react";

  type Category = {
  id: number;
  name: string;
};

type SubCategory = {
  id: number;
  name: string;
  category_id: number;
  category_name: string;
  description: string;
  image: string;
};

type Package = {
  id: number;
  name: string;
  description: string;
  subcategory_id: number;
  subcategory_name: string;
};

export interface Product {
  id: number;
  name: string;
  price: number;
  type: 'single' | 'combo';
  short_description: string;
  full_description: string;

  subcategory: {
    id: number;
    name: string;
    category_id: number;
  };

  package: {
    id: number;
    name: string;
  } | null;

  images: string[];
}
const role = localStorage.getItem("role");

export default function Product() {

  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [openEditProduct, setOpenEditProduct] = useState(false);
  const [openViewImage, setOpenViewImage] = useState(false);
  const [viewImages, setViewImages] = useState<string[] | null>(null);
  


//Lấy danh sách 
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubCategories] = useState<SubCategory[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts,setFilteredProducts] = useState<Product[]>([]);

  const [selectedCategoryFil, setSelectedCategoryFil] = useState<number | null>(null);
  const [selectedSubCategoryFil, setSelectedSubCategoryFil] = useState<number | null>(null);
  const [selectedPackageFil, setSelectedPackageFil] = useState<number | null>(null);
  const [filteredSubcategoriesFil, setFilteredSubcategoriesFil] = useState<SubCategory[]>([]);
  const [filteredPackagesFil, setFilteredPackagesFil] = useState<Package[]>([]);
  const handleCategoryChangeFil = (categoryId: number) => {
  setSelectedCategoryFil(categoryId);
  const filteredSubs = subcategories.filter((sub) => sub.category_id === categoryId);
  setFilteredSubcategoriesFil(filteredSubs);
  setFilteredPackagesFil([]);
  setSelectedSubCategoryFil(null);
  setSelectedPackageFil(null);
};

  const handleSubCategoryChangeFil = (subCategoryId: number) => {
  setSelectedSubCategoryFil(subCategoryId);
  const filteredPacks = packages.filter((pack) => pack.subcategory_id === subCategoryId);
  setFilteredPackagesFil(filteredPacks);
  setSelectedPackageFil(null);
};

  useEffect(() => {
    getListCategory();
    getListSubCategory();
    getListPackage();
    getListProduct();
  }, []);

  useEffect(() => {
  handleFilter();
}, [products,selectedCategoryFil, selectedSubCategoryFil, selectedPackageFil]);

  const getListCategory = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/category/getListCategory`);
      if (res.data.success) {
       setCategories(res.data.data); 
        console.log('Danh sách:', categories);
      }
    } catch (err) {
      console.error('Lỗi khi gọi API:', err);
    }
  };
  const getListSubCategory = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/category/getListSubCategory`);
      if (res.data.success) {
       setSubCategories(res.data.data); 
        console.log('Danh sách:', categories);
      }
    } catch (err) {
      console.error('Lỗi khi gọi API:', err);
    }
  };
  const getListPackage = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/category/getListPackage`);
    if (res.data.success) {
      setPackages(res.data.data); 
      console.log('Danh sách:', res.data.data);
    }
  } catch (err) {
    console.error('Lỗi khi gọi API:', err);
  }
};
  const getListProduct = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/product/getListProduct`);
    if (res.data.success) {
      setProducts(res.data.data);
      console.log('Danh sách sản phẩm:', res.data.data);
    } else {
      console.warn('API trả về lỗi:', res.data.message);
    }
  } catch (err) {
    console.error('Lỗi khi gọi API getListProduct:', err);
  }
};
  const handleFilter = () => {
    let filtered = [...products];

    if (selectedCategoryFil) {
      filtered = filtered.filter(
        (prod) => prod.subcategory.category_id === selectedCategoryFil
      );
    }

    if (selectedSubCategoryFil) {
      filtered = filtered.filter(
        (prod) => prod.subcategory.id === selectedSubCategoryFil
      );
    }

    if (selectedPackageFil) {
      filtered = filtered.filter(
        (prod) => prod.package?.id === selectedPackageFil
      );
    }

    setFilteredProducts(filtered);
  };

//{{{{{{{{{{{ Thêm sản phẩm
  const [sanPham, setSanPham] = useState("");
  const [price, setPrice] = useState<number | null>(null); 
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]); 
  const [type, setType] = useState<"single" | "combo">("single");
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (files && files.length > 0) {
    const fileArray = Array.from(files);
    setImages(fileArray); // Cập nhật state chứa danh sách file

    const previewPromises = fileArray.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previewPromises).then((previews) => {
      setPreviews(previews);
    });
  }
};
  // mô tả tóm tắt
  const editorRef1 = useRef<any>(null);
  // mô tả chi tiết
  const editorRef2 = useRef<any>(null);

//chọn danh sách category
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [filteredSubcategories, setFilteredSubcategories] = useState<SubCategory[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);

  const handleCategoryChange = (categoryId: number) => {
  setSelectedCategory(categoryId);
  setSelectedSubCategory(null);

  const filteredSubs = subcategories.filter((sub) => sub.category_id === categoryId);
  setFilteredSubcategories(filteredSubs);
  setFilteredPackages([]);
};

  const handleSubCategoryChange = (subCategoryId: number) => {
  setSelectedSubCategory(subCategoryId);
  const filteredPacks = packages.filter((pack) => pack.subcategory_id === subCategoryId);
  setFilteredPackages(filteredPacks);
};

  const addProduct = async () => {
  const content1 = editorRef1.current?.getContent() || "";
  const content2 = editorRef2.current?.getContent() || "";
  if (!sanPham || !selectedSubCategory || images.length === 0 || !price) {
    alert("Vui lòng nhập đầy đủ thông tin và chọn ảnh.");
    return;
  }

  const formData = new FormData();
  formData.append("name", sanPham);
  formData.append("subCategoryId", selectedSubCategory.toString());
  if (selectedPackage !== null) {
    formData.append("packageId", selectedPackage.toString());
  }
  formData.append("short_Description", content1);      // Editor 1
  formData.append("full_Description", content2); // Editor 2
  formData.append("price", price.toString()); 
  formData.append("type", type); 

  // Gắn từng ảnh vào
  images.forEach((file) => {
    formData.append("images", file);
  });

  try {
    const response = await axios.post(`${BASE_URL}/product/addProduct`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Thêm thành công", response.data);
    alert("Thêm sản phẩm thành công!");

    // Reset form
    setSanPham("");
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedPackage(null);
    setImages([]);
    setPreviews([]);
    editorRef1.current?.setContent("");
    editorRef2.current?.setContent("");
    setOpenAddProduct(false);
    getListProduct();
  } catch (error) {
  if (axios.isAxiosError(error)) {
    console.error("Lỗi khi thêm sản phẩm:", error.response?.data || error.message);
    alert("Lỗi: " + (error.response?.data?.message || "Không rõ nguyên nhân"));
  } else {
    console.error("Lỗi không xác định:", error);
    alert("Thêm sản phẩm thất bại.");
  }
}
};

// {{{{{{{{{{{ CẬP NHẬT sản phẩm
const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
const [editSanPham, setEditSanPham] = useState("");
const [editPrice, setEditPrice] = useState<number | null>(null);
const [editImages, setEditImages] = useState<File[]>([]);
const [editPreviews, setEditPreviews] = useState<string[]>([]);
const [editType, setEditType] = useState<"single" | "combo">("single");

const editEditorRef1 = useRef<any>(null);
const editEditorRef2 = useRef<any>(null);

const [editSelectedCategory, setEditSelectedCategory] = useState<number | null>(null);
const [editSelectedSubCategory, setEditSelectedSubCategory] = useState<number | null>(null);
const [editSelectedPackage, setEditSelectedPackage] = useState<number | null>(null);
const [editFilteredSubcategories, setEditFilteredSubcategories] = useState<SubCategory[]>([]);
const [editFilteredPackages, setEditFilteredPackages] = useState<Package[]>([]);
const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (files && files.length > 0) {
    const fileArray = Array.from(files);
    setEditImages(fileArray);

    const previewPromises = fileArray.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previewPromises).then((previews) => {
      setEditPreviews(previews);
    });
  }
};
  useEffect(() => {
    if (!openEditProduct || !selectedProduct) return;
    if (openEditProduct && selectedProduct) {
      setTimeout(() => {
      console.log("Short desc to set:", selectedProduct.short_description);
      console.log("Editor ref:", editEditorRef1.current);

      editEditorRef1.current?.setContent(selectedProduct.short_description || "");
      editEditorRef2.current?.setContent(selectedProduct.full_description || "");
    }, 1000);
      const matchedSub = subcategories.find(
        (sub) => sub.id === selectedProduct.subcategory.id
      );
      const categoryId = matchedSub?.category_id ?? null;

      setEditSanPham(selectedProduct.name);
      setEditPrice(selectedProduct.price);
      setEditType(selectedProduct.type);
      setEditSelectedCategory(categoryId);
      setEditSelectedSubCategory(selectedProduct.subcategory.id);
      setEditSelectedPackage(selectedProduct.package?.id ?? null);

      setEditPreviews(selectedProduct.images);
      setEditImages([]);

      

      if (categoryId !== null) {
        const filteredSubs = subcategories.filter(
          (sub) => sub.category_id === categoryId
        );
        setEditFilteredSubcategories(filteredSubs);
      } else {
        setEditFilteredSubcategories([]);
      }

      const filteredPacks = packages.filter(
        (pack) => pack.subcategory_id === selectedProduct.subcategory.id
      );
      setEditFilteredPackages(filteredPacks);
    }
  }, [openEditProduct, selectedProduct, subcategories, packages]);


  const updateProduct = async () => {
  if (!selectedProduct) {
    alert("Không có sản phẩm được chọn để cập nhật.");
    return;
  }

  const content1 = editEditorRef1.current?.getContent() || "";
  const content2 = editEditorRef2.current?.getContent() || "";

  if (!editSanPham || !editSelectedSubCategory || !editPrice) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  const formData = new FormData();
  formData.append("name", editSanPham);
  formData.append("subCategoryId", editSelectedSubCategory.toString());
  if (editSelectedPackage !== null) {
    formData.append("packageId", editSelectedPackage.toString());
  }
  formData.append("short_Description", content1);
  formData.append("full_Description", content2);
  formData.append("price", editPrice.toString());
  formData.append("type", editType);

  // Nếu có ảnh mới thì gửi kèm lên
  if (editImages.length > 0) {
    editImages.forEach((file) => {
      formData.append("images", file);
    });
  }

  try {
    const response = await axios.put(`${BASE_URL}/product/updateProduct/${selectedProduct.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Cập nhật thành công:", response.data);
    alert("Cập nhật sản phẩm thành công!");

    // Reset form
    setSelectedProduct(null);
    setEditSanPham("");
    setEditPrice(null);
    setEditImages([]);
    setEditPreviews([]);
    setEditSelectedCategory(null);
    setEditSelectedSubCategory(null);
    setEditSelectedPackage(null);
    editEditorRef1.current?.setContent("");
    editEditorRef2.current?.setContent("");
    setOpenEditProduct(false);
    getListProduct();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Lỗi khi cập nhật sản phẩm:", error.response?.data || error.message);
      alert("Lỗi: " + (error.response?.data?.message || "Không rõ nguyên nhân"));
    } else {
      console.error("Lỗi không xác định:", error);
      alert("Cập nhật sản phẩm thất bại.");
    }
  }
};
  const deleteProduct = async (productId: number) => {
  const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
  if (!confirmDelete) return;

  try {
    const response = await axios.delete(`${BASE_URL}/product/deleteProduct/${productId}`);
    console.log("Xóa thành công:", response.data);
    alert("Xóa sản phẩm thành công!");

    getListProduct(); // load lại danh sách
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Lỗi khi xóa sản phẩm:", error.response?.data || error.message);
      alert("Lỗi: " + (error.response?.data?.message || "Không rõ nguyên nhân"));
    } else {
      console.error("Lỗi không xác định:", error);
      alert("Xóa sản phẩm thất bại.");
    }
  }
};




  return (
    <div className="w-full">
      <div className="flex gap-4 flex-wrap pb-3">
     
      {/* Thêm sản phẩm */}
        <Dialog open={openAddProduct} onOpenChange={setOpenAddProduct}>
          <DialogTrigger asChild>
            <Button variant="outline">Thêm sản phẩm</Button>
          </DialogTrigger>
          <DialogContent className="max-w-[65rem] max-h-[90vh] overflow-y-auto" 
            onInteractOutside={(e) => {
            // Cho phép popup của TinyMCE hoạt động
            const target = e.target as HTMLElement;
            if (target.closest(".tox")) {
              e.preventDefault();
            }
          }}>
            <DialogHeader>
              <DialogTitle>Thêm sản phẩm</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Tên sản phẩm</Label>
                <Input
                  placeholder="Nhập tên sản phẩm"
                  value={sanPham}
                  onChange={(e) => setSanPham(e.target.value)}
                />
              </div>
              <div className="flex w-full gap-3">
                <div className="w-1/3">
                  <Select onValueChange={(value) => {const categoryId = Number(value); handleCategoryChange(categoryId)}}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn loại sản phẩm" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-1/3">
                  <Select onValueChange={(value) => {
                      const subCategoryId = Number(value);
                      handleSubCategoryChange(subCategoryId);
                    }}
                    disabled={!selectedCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn loại phụ" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSubcategories.map((sub) => (
                        <SelectItem key={sub.id} value={String(sub.id)}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Select onValueChange={(value) => {
                    if (value === "0" || null || undefined || "") {
                      setSelectedPackage(null);
                    } else {
                      setSelectedPackage(Number(value));
                    }
                  }}disabled={!selectedSubCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn Gói" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0">
                          Không chọn
                        </SelectItem>
                        {filteredPackages.map((pack) => (
                        <SelectItem key={pack.id} value={String(pack.id)}>
                          {pack.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Chọn ảnh sản phẩm</Label>
                <Input type="file" accept="image/*" multiple onChange={handleImageChange} />
                <div className="flex gap-2">
                  {previews && previews.map((src,index) => (
                    <img
                      key={index}
                      src={src}
                      alt={"Preview-"+{index}}
                      className="mt-2 max-h-40 rounded border object-cover"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="w-1/2">
                  <Label>Giá Sản Phẩm</Label>
                    <Input
                      placeholder="Nhập giá của sản phẩm"
                      value={price ?? ''}
                      onChange={(e) => setPrice(Number(e.target.value))}
                    />
                </div>
                <div className="flex-1">
                  <Label className="w-full text-center">Giá Sản Phẩm</Label>
                    <ToggleGroup
                      type="single"
                      value={type} // giá trị đang chọn
                      onValueChange={(val) => {
                        if (val) setType(val as "single" | "combo");
                      }}
                      className="gap-2"
                    >
                      <ToggleGroupItem value="single" aria-label="Gói đơn">
                        Gói đơn
                      </ToggleGroupItem>
                      <ToggleGroupItem value="combo" aria-label="Gói combo">
                        Gói combo
                      </ToggleGroupItem>
                    </ToggleGroup>
                </div>
              </div>

              <div>
                <Label>Mô tả</Label>
                <Editor
                    apiKey="mia9v15z0haplqqr2z5sfs498n4cbsd580bgnagfnpaayby0"
                    onInit={(_, editor) => (editorRef1.current = editor)}
                    init={{
                    height: 300,
                    plugins: [
                        // Core plugins
                        "anchor", "autolink", "charmap", "codesample", "emoticons", "image", "link", "lists", "media", "searchreplace", "table", "visualblocks", "wordcount",
                        "checklist", "mediaembed", "casechange", "formatpainter", "pageembed", "a11ychecker", "tinymcespellchecker", "permanentpen", "powerpaste", "advtable", "advcode", "editimage", "advtemplate", "mentions", "tinycomments", "tableofcontents", "footnotes", "mergetags", "autocorrect", "typography", "inlinecss", "markdown", "importword", "exportword", "exportpdf"
                    ],
                    toolbar:
                        "undo redo | blocks| bold emoticons numlist bullist image hr|",
                    tinycomments_mode: "embedded",
                    tinycomments_author: "Author name",
                    mergetags_list: [
                        { value: "First.Name", title: "First Name" },
                        { value: "Email", title: "Email" },
                        ],
                        }}
                />
              </div>
              <div>
                <Label>Mô tả chi tiết</Label>
                <Editor
                    apiKey="mia9v15z0haplqqr2z5sfs498n4cbsd580bgnagfnpaayby0"
                    onInit={(_, editor) => (editorRef2.current = editor)}
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
              </div>
            </div>

          <DialogFooter>
            <Button
              onClick={() => addProduct()
              }
            >
              Lưu
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

      {/* Update sản phẩm */}
        <Dialog open={openEditProduct} onOpenChange={setOpenEditProduct}>
          <DialogContent className="max-w-[65rem] max-h-[90vh] overflow-y-auto" 
            onInteractOutside={(e) => {
            // Cho phép popup của TinyMCE hoạt động
            const target = e.target as HTMLElement;
            if (target.closest(".tox")) {
              e.preventDefault();
            }
          }}>
            <DialogHeader>
              <DialogTitle>Update sản phẩm</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Tên sản phẩm</Label>
                <Input
                  placeholder="Nhập tên sản phẩm"
                  value={editSanPham}
                  onChange={(e) => setEditSanPham(e.target.value)}
                />
              </div>
              <div className="flex w-full gap-3">
                <div className="w-1/3">
                  <Select 
                  value={editSelectedCategory ? String(editSelectedCategory) : undefined} 
                  onValueChange={(value) => {
                    const categoryId = Number(value);
                    setEditSelectedCategory(categoryId);

                    const filteredSubs = subcategories.filter(sub => sub.category_id === categoryId);
                    setEditFilteredSubcategories(filteredSubs);
                    setEditSelectedSubCategory(null);
                    setEditSelectedPackage(null);
                    setEditFilteredPackages([]);
                  }}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn loại sản phẩm" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-1/3">
                  <Select
                    value={editSelectedSubCategory ? String(editSelectedSubCategory) : undefined} 
                    onValueChange={(value) => {
                      const subCategoryId = Number(value);
                      setEditSelectedSubCategory(subCategoryId);
                      const filteredPacks = packages.filter((pack) => pack.subcategory_id === subCategoryId);
                      setEditFilteredPackages(filteredPacks);
                      setEditSelectedPackage(null);
                    }}
                    disabled={!editSelectedCategory}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn loại phụ" />
                    </SelectTrigger>
                    <SelectContent>
                      {editFilteredSubcategories.map((sub) => (
                        <SelectItem key={sub.id} value={String(sub.id)}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Select
                    value={editSelectedPackage ? String(editSelectedPackage) : undefined} 
                    onValueChange={(value) => {
                      if (value === "0") {
                        setEditSelectedPackage(null);
                      } else {
                        setEditSelectedPackage(Number(value));
                      }
                    }}
                    disabled={!editSelectedSubCategory}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn Gói" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Không chọn</SelectItem>
                      {editFilteredPackages.map((pack) => (
                        <SelectItem key={pack.id} value={String(pack.id)}>
                          {pack.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Chọn ảnh sản phẩm</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleEditImageChange}
                />
                <div className="flex gap-2">
                  {editPreviews.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`Preview-${index}`}
                      className="mt-2 max-h-40 rounded border object-cover"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="w-1/2">
                  <Label>Giá Sản Phẩm</Label>
                    <Input
                      placeholder="Nhập giá của sản phẩm"
                      value={editPrice ?? ''}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                    />
                </div>
                <div className="flex-1">
                  <Label className="w-full text-center">Giá Sản Phẩm</Label>
                    <ToggleGroup
                      type="single"
                      value={editType}
                      onValueChange={(val) => {
                        if (val) setEditType(val as "single" | "combo");
                      }}
                      className="gap-2"
                    >
                      <ToggleGroupItem value="single" aria-label="Gói đơn">
                        Gói đơn
                      </ToggleGroupItem>
                      <ToggleGroupItem value="combo" aria-label="Gói combo">
                        Gói combo
                      </ToggleGroupItem>
                    </ToggleGroup>
                </div>
              </div>

              <div>
                <Label>Mô tả</Label>
                <Editor
                    apiKey="mia9v15z0haplqqr2z5sfs498n4cbsd580bgnagfnpaayby0"
                    onInit={(_, editor) => (editEditorRef1.current = editor)}
                    init={{
                    height: 300,
                    plugins: [
                        // Core plugins
                        "anchor", "autolink", "charmap", "codesample", "emoticons", "image", "link", "lists", "media", "searchreplace", "table", "visualblocks", "wordcount",
                        "checklist", "mediaembed", "casechange", "formatpainter", "pageembed", "a11ychecker", "tinymcespellchecker", "permanentpen", "powerpaste", "advtable", "advcode", "editimage", "advtemplate", "mentions", "tinycomments", "tableofcontents", "footnotes", "mergetags", "autocorrect", "typography", "inlinecss", "markdown", "importword", "exportword", "exportpdf"
                    ],
                    toolbar:
                        "undo redo | blocks| bold emoticons numlist bullist image hr|",
                    tinycomments_mode: "embedded",
                    tinycomments_author: "Author name",
                    mergetags_list: [
                        { value: "First.Name", title: "First Name" },
                        { value: "Email", title: "Email" },
                        ],
                        }}
                />
              </div>
              <div>
                <Label>Mô tả chi tiết</Label>
                <Editor
                    apiKey="mia9v15z0haplqqr2z5sfs498n4cbsd580bgnagfnpaayby0"
                    onInit={(_, editor) => (editEditorRef2.current = editor)}
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
              </div>
            </div>

          <DialogFooter>
            <Button
              onClick={() => updateProduct()
              }
            >
              Lưu
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
    </div>
              <div className="flex w-full gap-3 py-3">
                <div className="w-1/3">
                  <Select onValueChange={(value) => {const categoryId = Number(value); handleCategoryChangeFil(categoryId)}}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn loại sản phẩm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">
                          Tất cả
                        </SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-1/3">
                  <Select onValueChange={(value) => {
                      const subCategoryId = Number(value);
                      handleSubCategoryChangeFil(subCategoryId);
                    }}
                    disabled={!selectedCategoryFil}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn loại phụ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">
                          Tất cả
                        </SelectItem>
                      {filteredSubcategoriesFil.map((sub) => (
                        <SelectItem key={sub.id} value={String(sub.id)}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-1/3">
                  <Select onValueChange={(value) => {
                    if (value === "0" || null || undefined || "") {
                      setSelectedPackageFil(null);
                    } else {
                      setSelectedPackageFil(Number(value));
                    }
                  }}disabled={!selectedSubCategoryFil}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn Gói" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0">
                          Tất cả
                        </SelectItem>
                        {filteredPackagesFil.map((pack) => (
                        <SelectItem key={pack.id} value={String(pack.id)}>
                          {pack.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>              
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="w-full overflow-x-auto p-4">
          <table className="w-full min-w-[1000px] border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Tên sản phẩm</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thuộc</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ảnh</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-medium text-gray-800">
                        {item.subcategory.name}
                      </span>
                      <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.package?.name ?? "Không thuộc gói"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.price.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50"
                      onClick={()=>{setViewImages(item.images);setOpenViewImage(true);}}
                    >
                      Xem ảnh
                    </Button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${item.type === 'single' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-3">
                      <button 
                        onClick={()=>{setOpenEditProduct(true),setSelectedProduct(item)}}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button 
                        onClick={()=> deleteProduct(item.id)}
                        className={`text-red-600 hover:text-red-900 ${role==="staff" && "hidden"}`}
                      >
                        <RiDeleteBin6Line size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog open={openViewImage} onOpenChange={setOpenViewImage}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Ảnh Sản Phẩm</DialogTitle>
          </DialogHeader>

          {viewImages && viewImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {viewImages.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Ảnh sản phẩm ${index}`}
                  className="w-full aspect-[16/11] object-fill rounded border"
                />
              ))}
            </div>
          ) : (
            <p className="text-center mt-4 text-gray-500">Không có ảnh để hiển thị.</p>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
