import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BASE_URL } from "../../../link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
interface User {
  id: number;
  full_name: string;
  username: string;
  phone: string;
  birthday: string;
  role: "admin" | "manager" | "staff";
}

const UserAdmin = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/auth/getUsers`);
      const data = res.data;

      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error("Không thể tải danh sách người dùng");
      }
    } catch (error) {
      toast.error("Lỗi kết nối máy chủ");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const [showDialogAdd,setShowDialogAdd] = useState(false);
    const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    password: "",
    phone: "",
    birthday: "",
    role: "staff",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.full_name || !formData.username || !formData.password) {
      toast.error("Vui lòng điền đầy đủ họ tên, username và mật khẩu");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/addUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Thêm nhân viên thành công");
        setShowDialogAdd(false);
        fetchUsers();
      } else {
        toast.error(data.message || "Thêm thất bại");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối máy chủ");
    }
  };



    const [showDialogEdit, setShowDialogEdit] = useState(false);
    const [formEdit, setFormEdit] = useState({
    id: 0,
    full_name: "",
    username: "",
    password: "",
    phone: "",
    birthday: "",
    role: "staff",
    });
    const handleEditClick = (user: User) => {
        setFormEdit({
            id: user.id,
            full_name: user.full_name,
            username: user.username,
            password: "", 
            phone: user.phone,
            birthday: user.birthday?.slice(0, 10),
            role: user.role,
        });
        setShowDialogEdit(true);
    };
    const handleEditChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
        ) => {
        const { name, value } = e.target;
        setFormEdit((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        if (!formEdit.full_name || !formEdit.username) {
            toast.error("Vui lòng nhập đầy đủ họ tên và tên đăng nhập");
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/auth/updateUser`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formEdit),
            });

            const data = await res.json();

            if (data.success) {
            toast.success("Cập nhật thành công");
            setShowDialogEdit(false);
            fetchUsers();
            } else {
            toast.error(data.message || "Cập nhật thất bại");
            }
        } catch (err) {
            console.error("Lỗi cập nhật:", err);
            toast.error("Lỗi kết nối máy chủ");
        }
    };


    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const handleDelete = async (id?: number) => {
        if (!id) return;

        try {
            const res = await fetch(`${BASE_URL}/auth/deleteUser/${id}`, {
            method: "DELETE",
            });

            const data = await res.json();

            if (data.success) {
            toast.success("Xoá thành công");
            fetchUsers();
            } else {
            toast.error(data.message || "Xoá thất bại");
            }
        } catch (err) {
            console.error("Lỗi khi xoá:", err);
            toast.error("Lỗi kết nối máy chủ");
        } finally {
            setShowDeleteDialog(false);
            setUserToDelete(null);
        }
    };





  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý nhân viên</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors" 
            onClick={()=>setShowDialogAdd(true)}>
            Thêm nhân viên
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên đăng nhập</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SĐT</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày sinh</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.full_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.username}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.birthday).toLocaleDateString("vi-VN")}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                    user.role === 'manager' ? 'bg-blue-100 text-blue-800' : 
                    'bg-green-100 text-green-800'}`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900 mr-4"
                    onClick={()=> handleEditClick(user)}>Sửa</button>
                <button className="text-red-600 hover:text-red-900"
                    onClick={() => {setUserToDelete(user);setShowDeleteDialog(true);}}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={showDialogAdd} onOpenChange={setShowDialogAdd}>
        <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
            <DialogTitle>Thêm Nhân Viên</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Nhập họ tên"
                />
                </div>
                <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Nhập tên đăng nhập"
                />
                </div>
                <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Nhập mật khẩu"
                />
                </div>
                <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Nhập số điện thoại"
                />
                </div>
                <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
                </div>
                <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                >
                    <option value="staff">Nhân viên</option>
                    <option value="manager">Quản lý</option>
                    <option value="admin">Admin</option>
                </select>
                </div>
            </div>
            </div>
            <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowDialogAdd(false)}>
                Đóng
            </Button>
            <Button type="button" className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
                Lưu thay đổi
            </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>

        <Dialog open={showDialogEdit} onOpenChange={setShowDialogEdit}>
        <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
            <DialogTitle>Cập Nhật Nhân Viên</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                <input
                    type="text"
                    name="full_name"
                    value={formEdit.full_name}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Nhập họ tên"
                />
                </div>
                <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
                <input
                    type="text"
                    name="username"
                    value={formEdit.username}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Nhập tên đăng nhập"
                />
                </div>
                <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                <input
                    type="password"
                    name="password"
                    value={formEdit.password}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Nhập mật khẩu"
                />
                </div>
                <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input
                    type="tel"
                    name="phone"
                    value={formEdit.phone}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Nhập số điện thoại"
                />
                </div>
                <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                <input
                    type="date"
                    name="birthday"
                    value={formEdit.birthday}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
                </div>
                <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                <select
                    name="role"
                    value={formEdit.role}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                >
                    <option value="staff">Nhân viên</option>
                    <option value="manager">Quản lý</option>
                    <option value="admin">Admin</option>
                </select>
                </div>
            </div>
            </div>
            <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowDialogEdit(false)}>
                Đóng
            </Button>
            <Button type="button" className="bg-blue-600 hover:bg-blue-700" onClick={handleUpdate}>
                Lưu thay đổi
            </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                <DialogTitle>Xác nhận xoá</DialogTitle>
                <DialogDescription>
                    Bạn có chắc chắn muốn xoá nhân viên{" "}
                    <strong>{userToDelete?.full_name}</strong> không? Hành động này không thể hoàn tác.
                </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                <Button
                    variant="outline"
                    onClick={() => setShowDeleteDialog(false)}
                >
                    Huỷ
                </Button>
                <Button
                    variant="destructive"
                    onClick={() => handleDelete(userToDelete?.id)}
                >
                    Xoá
                </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    </div>
  );
};

export default UserAdmin;
