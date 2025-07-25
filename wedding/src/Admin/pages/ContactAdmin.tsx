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
interface Contact {
  id: number;
  ten: string;
  phone: number;
  messenger: string;
  created_at: string;
  trang_thai: string;
}

const ContactAdmin = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [contactToProcess, setContactToProcess] = useState<Contact | null>(null);
  const handleOpenProcessDialog = (contact: Contact) => {
    setContactToProcess(contact);
    setShowProcessDialog(true);
  };
  const handleProcess = async () => {
    if (!contactToProcess) return;

    try {
        const res = await axios.put(`${BASE_URL}/lienHe/updateTrangThai`, {
        id: contactToProcess.id,
        trang_thai: "Đã xử lý", 
        });

        if (res.data.success) {
        toast.success("Đã cập nhật trạng thái!");
        fetchContacts();
        } else {
        toast.error("Cập nhật thất bại");
        }
    } catch (error) {
        toast.error("Lỗi kết nối khi cập nhật");
    } finally {
        setShowProcessDialog(false);
        setContactToProcess(null);
    }
  };

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
    const handleOpenDeleteDialog = (contact: Contact) => {
        setContactToDelete(contact);
        setShowDeleteDialog(true);
    };
    const handleDelete = async () => {
        if (!contactToDelete) return;

        try {
            const res = await axios.delete(`${BASE_URL}/lienHe/deleteLienHe/${contactToDelete.id}`);

            if (res.data.success) {
            toast.success("Xoá liên hệ thành công");
            fetchContacts(); // Refresh danh sách
            } else {
            toast.error("Xoá thất bại");
            }
        } catch (error) {
            toast.error("Lỗi kết nối khi xoá");
            console.error(error);
        } finally {
            setShowDeleteDialog(false);
            setContactToDelete(null);
        }
    };





  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/lienHe/getLienHe`);
      const data = res.data;

      if (data.success) {
        setContacts(data.data);
      } else {
        toast.error("Không thể tải danh sách người dùng");
      }
    } catch (error) {
      toast.error("Lỗi kết nối máy chủ");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Liên Hệ</h2>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SĐT</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nội Dung</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contacts.map((contact) => (
            <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contact.ten}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.messenger}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(contact.created_at).toLocaleDateString("vi-VN")}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(contact.trang_thai) === "Chưa xử lý" ? "Chưa xử lý" : "Đã xử lý"}
                </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                {contact.trang_thai === "Chưa xử lý" ?
                <button className="text-indigo-600 hover:text-indigo-900 mr-4" onClick={() => handleOpenProcessDialog(contact)}
                    >Xử Lý</button>
                : 
                <button className="text-red-600 hover:text-red-900" onClick={() => handleOpenDeleteDialog(contact)}
                   >Xoá
                </button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

          <Dialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                <DialogTitle>Xác nhận xử lý</DialogTitle>
                <DialogDescription>
                    Bạn có chắc chắn muốn đánh dấu liên hệ của{" "}
                    <strong>{contactToProcess?.ten}</strong> là <strong>đã xử lý</strong>?
                </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                <Button variant="outline" onClick={() => setShowProcessDialog(false)}>
                    Huỷ
                </Button>
                <Button variant="default" onClick={handleProcess}>
                    Đồng ý
                </Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>


        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                <DialogTitle>Xác nhận xoá</DialogTitle>
                <DialogDescription>
                    Bạn có chắc chắn muốn xoá liên hệ từ <strong>{contactToDelete?.ten}</strong> không?
                    Hành động này <span className="text-red-600 font-semibold">không thể hoàn tác</span>.
                </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    Huỷ
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                    Xoá
                </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>


    </div>
  );
};

export default ContactAdmin;
