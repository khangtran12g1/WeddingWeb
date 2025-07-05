import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import {BASE_URL} from "../../../link"
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
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import axios from 'axios';

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
export default function Category() {
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubCategories] = useState<SubCategory[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    getListCategory();
    getListSubCategory();
    getListPackage();
  }, []);

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

  // Category
  const [openCategory, setOpenCategory] = useState(false);
  const [openSubCategory, setOpenSubCategory] = useState(false);
  const [openPackage, setOpenPackage] = useState(false);
  const [tablle, setTable] = useState("category");
  
  const [category, setCategory] = useState("");
  const addCategory = async () => {
    const name = category;
  try {
    const res = await axios.post(`${BASE_URL}/category/addCategory`, {
      name,
    });

    if (res.data.success) {
      alert('Thêm category thành công!');
      setOpenCategory(false);
      setCategory("");
      getListCategory();
    } else {
      alert('Thất bại: ' + res.data.message);
    }
  } catch (err) {
    console.error('Lỗi gọi API:', err);
    alert('Lỗi khi kết nối đến server');
  }
};

  const [editCategory, setEditCategory] = useState(""); 
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null); 
  const [openEditCategory, setOpenEditCategory] = useState(false);
  const handleOpenEditCategory = (category: { id: number; name: string }) => {
  setEditCategory(category.name);
  setEditCategoryId(category.id);
  setOpenEditCategory(true);
};
  const updateCategory = async () => {
  if (!editCategoryId || !editCategory.trim()) {
    alert("Vui lòng nhập tên category hợp lệ");
    return;
  }

  try {
    const res = await axios.put(`${BASE_URL}/category/updateCategory/${editCategoryId}`, {
      name: editCategory,
    });

    if (res.data.success) {
      alert("Cập nhật thành công!");
      setOpenEditCategory(false);
      setEditCategory("");
      setEditCategoryId(null);
      getListCategory();
    } else {
      alert("Thất bại: " + res.data.message);
    }
  } catch (err) {
    console.error("Lỗi khi cập nhật category:", err);
    alert("Lỗi server");
  }
};
  const deleteCategory = async (id: number) => {
  if (!window.confirm("Bạn có chắc chắn muốn xóa category này?")) return;

  try {
    const res = await axios.delete(`${BASE_URL}/category/deleteCategory/${id}`);
    if (res.data.success) {
      alert("Đã xóa thành công!");
      getListCategory(); // Refresh danh sách
    } else {
      alert("Thất bại: " + res.data.message);
    }
  } catch (error) {
    console.error("Lỗi khi xóa category:", error);
    alert("Lỗi server");
  }
};


// Subcategory
  const [subCategory, setSubCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [moTa, setMoTa] = useState("");
  const [file, setFile] = useState<File | null>(null); 
  const [preview, setPreview] = useState<string | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f); 
      setPreview(URL.createObjectURL(f));
    }
  };
  const addSubCategory = async () => {
  if (!subCategory || !moTa || !selectedCategory || !file) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }
  const formData = new FormData();
  formData.append('name', subCategory);
  formData.append('description', moTa);
  formData.append('category_id', selectedCategory);
  formData.append('image', file); 
  try {
    const res = await axios.post(`${BASE_URL}/category/addSubcategory`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.data.success) {
      alert("Thêm thành công");
      setOpenSubCategory(false);
      setSubCategory("");
      setMoTa("");
      setFile(null);
      setPreview(null);
      setSelectedCategory(undefined);
      getListSubCategory();
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.error('Lỗi khi thêm:', err);
    alert('Lỗi máy chủ');
  }
};

  const [editSubCategory, setEditSubCategory] = useState("");
  const [editMoTa, setEditMoTa] = useState("");
  const [editSelectedCategory, setEditSelectedCategory] = useState<string | undefined>();
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [editSubCategoryId, setEditSubCategoryId] = useState<number | null>(null);
  const [openEditSubCategory, setOpenEditSubCategory] = useState(false);
  const handleOpenEditSubCategory = (sub: SubCategory) => {
  setEditSubCategory(sub.name);
  setEditMoTa(sub.description);
  setEditSelectedCategory(String(sub.category_id));
  setEditPreview(sub.image); // link ảnh cũ từ DB
  setEditFile(null); // reset file để đợi user chọn lại nếu muốn
  setEditSubCategoryId(sub.id);
  setOpenEditSubCategory(true);
};
  const updateSubCategory = async () => {
  if (!editSubCategory || !editMoTa || !editSelectedCategory || !editSubCategoryId) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }

  const formData = new FormData();
  formData.append("name", editSubCategory);
  formData.append("description", editMoTa);
  formData.append("category_id", editSelectedCategory);
  if (editFile) {
    formData.append("image", editFile); // gửi ảnh nếu có chọn ảnh mới
  }

  try {
    const res = await axios.put(`${BASE_URL}/category/updateSubcategory/${editSubCategoryId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.success) {
      alert("Cập nhật thành công!");
      setOpenEditSubCategory(false);
      setEditSubCategory("");
      setEditMoTa("");
      setEditSelectedCategory(undefined);
      setEditFile(null);
      setEditPreview(null);
      setEditSubCategoryId(null);
      getListSubCategory(); // load lại danh sách
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.error("Lỗi khi cập nhật:", err);
    alert("Lỗi máy chủ");
  }
};
  const deleteSubCategory = async (id: number) => {
  const confirmDelete = window.confirm("Bạn có chắc muốn xoá subcategory này?");
  if (!confirmDelete) return;

  try {
    const res = await axios.delete(`${BASE_URL}/category/deleteSubcategory/${id}`);

    if (res.data.success) {
      alert("Xoá thành công!");
      getListSubCategory(); // load lại danh sách
    } else {
      alert("Thất bại: " + res.data.message);
    }
  } catch (err) {
    console.error("Lỗi khi xoá:", err);
    alert("Lỗi máy chủ");
  }
};




  const [packageName,setPackageName]= useState("");
  const [packagedescription,setPackagedescription ]= useState("");
  const [selectedCategorys, setSelectedCategorys] = useState<string>('');
  const [filteredSubcategories, setFilteredSubcategories] = useState<SubCategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(''); 
  const handleCategoryChange = (value: string) => {
    setSelectedCategorys(value);
    const filtered = subcategories.filter((sub) => sub.category_id.toString() === value);
    setFilteredSubcategories(filtered);
    setSelectedSubcategory(''); 
  };
  const addPackage = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/category/addPackage`, {
      name: packageName,
      description: packagedescription,
      subcategory_id: selectedSubcategory, // hoặc parseInt(selectedSubcategory)
    });

    if (res.data.success) {
      alert('Thêm Package thành công!');
      setOpenPackage(false);
      setPackageName("");
      setPackagedescription("");
      setSelectedCategorys("");
      setSelectedSubcategory("");
      getListPackage();
    } else {
      alert('Thất bại: ' + res.data.message);
    }
  } catch (err) {
    console.error('Lỗi gọi API:', err);
    alert('Lỗi khi kết nối đến server');
  }
};

  const [editPackageName, setEditPackageName] = useState("");
  const [editPackageDescription, setEditPackageDescription] = useState("");
  const [editSelectedCategoryId, setEditSelectedCategoryId] = useState<string>("");
  const [editFilteredSubcategories, setEditFilteredSubcategories] = useState<SubCategory[]>([]);
  const [editSelectedSubcategoryId, setEditSelectedSubcategoryId] = useState<string>("");
  const [editPackageId, setEditPackageId] = useState<number | null>(null);
  const [openEditPackage, setOpenEditPackage] = useState(false);

  const handleOpenEditPackage = (pack: Package) => {
  setEditPackageId(pack.id);
  setEditPackageName(pack.name);
  setEditPackageDescription(pack.description);
  setEditSelectedSubcategoryId(pack.subcategory_id.toString());

  const matchedSub = subcategories.find((sub) => sub.id === pack.subcategory_id);
  if (matchedSub) {
    setEditSelectedCategoryId(matchedSub.category_id.toString());

    const filteredSubs = subcategories.filter(
      (sub) => sub.category_id === matchedSub.category_id
    );
    setEditFilteredSubcategories(filteredSubs);
  }

  setOpenEditPackage(true);
};
  const updatePackage = async () => {
  if (!editPackageId || !editPackageName.trim() || !editSelectedSubcategoryId) {
    alert("Vui lòng điền đầy đủ thông tin");
    return;
  }

  try {
    const res = await axios.put(`${BASE_URL}/category/updatePackage/${editPackageId}`, {
      name: editPackageName,
      description: editPackageDescription,
      subcategory_id: parseInt(editSelectedSubcategoryId),
    });

    if (res.data.success) {
      alert("Cập nhật package thành công!");
      setOpenEditPackage(false);
      getListPackage();

      // Reset form
      setEditPackageId(null);
      setEditPackageName("");
      setEditPackageDescription("");
      setEditSelectedCategoryId("");
      setEditSelectedSubcategoryId("");
    } else {
      alert("Cập nhật thất bại: " + res.data.message);
    }
  } catch (err) {
    console.error("Lỗi khi gọi API cập nhật package:", err);
    alert("Lỗi kết nối server");
  }
};
const deletePackage = async (id: number) => {
  const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa gói này?");
  if (!confirmDelete) return;

  try {
    const res = await axios.delete(`${BASE_URL}/category/deletePackage/${id}`);
    if (res.data.success) {
      alert("Đã xóa gói thành công!");
      getListPackage(); // cập nhật lại danh sách
    } else {
      alert("Xóa thất bại: " + res.data.message);
    }
  } catch (err) {
    console.error("Lỗi khi xóa package:", err);
    alert("Không thể kết nối đến máy chủ.");
  }
};




  return (
    <div className="w-full">
      <div className="flex gap-4 flex-wrap pb-3">
        <Dialog open={openCategory} onOpenChange={setOpenCategory} >
          <DialogTrigger asChild>
            <Button variant="outline">Thêm danh mục </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle >Thêm danh mục </DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Nhập tên loại sản phẩm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <DialogFooter>
              <Button onClick={() =>addCategory() }>Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
         <Dialog open={openEditCategory} onOpenChange={setOpenEditCategory} >
          <DialogContent>
            <DialogHeader>
              <DialogTitle >Cập nhật danh mục</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Nhập tên loại sản phẩm"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
            />
            <DialogFooter>
              <Button onClick={() =>updateCategory() }>Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      {/* Thêm sub loại sản phẩm */}
        <Dialog open={openSubCategory} onOpenChange={setOpenSubCategory}>
          <DialogTrigger asChild>
            <Button variant="outline">Thêm danh mục con</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thêm danh mục con</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Nhập tên sub loại"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
            />
            <div className="w-1/2">
                  <Select onValueChange={(value) => setSelectedCategory(value)} value={selectedCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn loại sản phẩm" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
            </div>
            <Input
              placeholder="Nhập mô tả"
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
            />
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && <img src={preview} alt="Xem trước ảnh" className="mt-2 max-w-xs" />}
            
            <DialogFooter>
              <Button onClick={() =>addSubCategory()}>Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={openEditSubCategory} onOpenChange={setOpenEditSubCategory}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cập nhật danh mục con</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Nhập tên sub loại"
              value={editSubCategory}
              onChange={(e) => setEditSubCategory(e.target.value)}
            />
            <div className="w-1/2">
                  <Select onValueChange={(value) => setEditSelectedCategory(value)} value={editSelectedCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn loại sản phẩm" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
            </div>
            <Input
              placeholder="Nhập mô tả"
              value={editMoTa}
              onChange={(e) => setEditMoTa(e.target.value)}
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setEditFile(f); // lưu file mới vào editFile
                  setEditPreview(URL.createObjectURL(f)); // hiển thị ảnh preview mới
                }
              }}
            />
            {editPreview && <img src={editPreview} alt="Xem trước ảnh" className="mt-2 max-w-xs" />}
            
            <DialogFooter>
              <Button onClick={() =>updateSubCategory()}>Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={openPackage} onOpenChange={setOpenPackage}>
          <DialogTrigger asChild>
            <Button variant="outline">Thêm Gói Sản Phẩm</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle >Thêm Gói Sản Phẩm</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Nhập tên gói"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
            />
            <div className="flex gap-2">
              {/* Select Category */}
              <div className="w-1/2">
                <Select onValueChange={handleCategoryChange} value={selectedCategorys}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn loại sản phẩm" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Select SubCategory */}
              <div className="w-1/2">
                <Select
                  onValueChange={(value) => setSelectedSubcategory(value)}
                  value={selectedSubcategory}
                  disabled={!selectedCategorys} // disable nếu chưa chọn cha
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn loại sản phẩm con" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSubcategories.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Input
              placeholder="Nhập mô tả"
              value={packagedescription}
              onChange={(e) => setPackagedescription(e.target.value)}
            />
            <DialogFooter>
              <Button onClick={() =>addPackage() }>Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={openEditPackage} onOpenChange={setOpenEditPackage}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cập nhật Gói Sản Phẩm</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Nhập tên gói"
              value={editPackageName}
              onChange={(e) => setEditPackageName(e.target.value)}
            />
            <div className="flex gap-2">
              {/* Select Category */}
              <div className="w-1/2">
                <Select
                  onValueChange={(value) => {
                    setEditSelectedCategoryId(value);
                    const filtered = subcategories.filter(
                      (sub) => sub.category_id.toString() === value
                    );
                    setEditFilteredSubcategories(filtered);
                    setEditSelectedSubcategoryId('');
                  }}
                  value={editSelectedCategoryId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn loại sản phẩm" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Select SubCategory */}
              <div className="w-1/2">
                <Select
                  onValueChange={(value) => setEditSelectedSubcategoryId(value)}
                  value={editSelectedSubcategoryId}
                  disabled={!editSelectedCategoryId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn loại sản phẩm con" />
                  </SelectTrigger>
                  <SelectContent>
                    {editFilteredSubcategories.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mô tả */}
            <Input
              placeholder="Nhập mô tả"
              value={editPackageDescription}
              onChange={(e) => setEditPackageDescription(e.target.value)}
            />

            <DialogFooter>
              <Button onClick={updatePackage}>Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>



      {/* Thêm sản phẩm */}
    </div>
      <div className="flex pb-4 gap-3">
        <Button variant="outline" onClick={()=>setTable('category')}>Danh Mục</Button>
        <Button variant="outline"onClick={()=>setTable('subcategory')}>Danh Mục Con</Button>
        <Button variant="outline"onClick={()=>setTable('package')}>Gói Sản Phẩm</Button>
      </div>
    
      <div className="rounded-2xl border border-gray-300 bg-white">
        <div className="w-full overflow-x-auto max-w-full p-4">
          <div className="min-w-[1000px]">
            <table className="w-full overflow-x-scroll border-collapse text-left">
              {tablle === 'category' && (
                <>
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="border-b px-5 py-4">STT</th>
                      <th className="border-b px-5 py-4">Tên Category</th>
                      <th className="border-b px-5 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((item, index) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="px-5 py-4">{index + 1}</td>
                        <td className="px-5 py-4">{item.name}</td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <FiEdit size={20} onClick={()=> handleOpenEditCategory(item)}/>
                            <RiDeleteBin6Line size={20} onClick={()=> deleteCategory(item.id)} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

              {tablle === 'subcategory' && (
                <>
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="border-b px-5 py-4 w-[50px]">STT</th>
                      <th className="border-b px-5 py-4 w-[200px]">Tên SubCategory</th>
                      <th className="border-b px-5 py-4 w-[200px]">Thuộc</th>
                      <th className="border-b px-5 py-4">Mô tả</th>
                      <th className="border-b px-5 py-4 w-[100px]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subcategories.map((item, index) => (
                      <tr
                        key={item.id}
                        className="group border-b transition hover:bg-gray-100"
                      >
                        <td className="px-5 py-4 font-medium text-gray-700">{index + 1}</td>
                        <td className="px-5 py-4 ">
                          <div className="flex flex-col items-center w-full">
                            <span className="text-base font-medium text-gray-800">
                              {item.name}
                            </span>
                            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 font-medium">
                            {item.category_name}
                          </span>
                          </div>
                        </td>
                         <td className="px-5 py-4">
                          <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-16 object-cover rounded-md shadow-sm"
                            />
                        </td>
                        <td className="px-5 py-4 text-gray-600 text-sm">
                          {item.description.length > 200
                            ? item.description.slice(0, 200) + '...'
                            : item.description}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              className="text-blue-600 hover:text-blue-800 transition"
                              title="Chỉnh sửa"
                            >
                              <FiEdit size={20} onClick={()=> handleOpenEditSubCategory(item)} />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800 transition"
                              title="Xoá"
                            >
                              <RiDeleteBin6Line size={20} onClick={()=> deleteSubCategory(item.id)} />
                            </button>
                          </div>
                        </td>
                      </tr>

                    ))}
                  </tbody>
                </>
              )}

              {tablle === 'package' && (
                <>
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="border-b px-5 py-4 w-[50px]">STT</th>
                      <th className="border-b px-5 py-4 text-center w-1/4">Tên Gói</th>
                      <th className="border-b px-5 py-4">Mô tả</th>
                      <th className="border-b px-5 py-4 w-1/6">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map((item, index) => (
                      <tr
                        key={item.id}
                        className="group border-b transition hover:bg-gray-100"
                      >
                        <td className="px-5 py-4 font-medium text-gray-700">{index + 1}</td>
                        <td className="px-5 py-4 ">
                          <div className="flex flex-col items-center w-full">
                            <span className="text-base font-medium text-gray-800">
                              {item.name}
                            </span>
                            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 font-medium">
                            {item.subcategory_name}
                          </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-600 text-sm">
                          {item.description.length > 200
                            ? item.description.slice(0, 200) + '...'
                            : item.description}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              className="text-blue-600 hover:text-blue-800 transition"
                              title="Chỉnh sửa"
                            >
                              <FiEdit size={20} onClick={()=> handleOpenEditPackage(item)}/>
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800 transition"
                              title="Xoá"
                            >
                              <RiDeleteBin6Line size={20} onClick={()=> deletePackage(item.id)}/>
                            </button>
                          </div>
                        </td>
                      </tr>

                    ))}
                  </tbody>
                </>
              )}
            </table>
          </div>
        </div>
      </div>

    </div>

    
  );
}
