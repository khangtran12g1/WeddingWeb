import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Minus, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
interface Order {
  id: number;
  order_code : string;
  customer_name: string;
  phone: string;
  email?: string;
  address: string;
  wedding_date: string;
  note?: string;
  total_price: number;
  status: string;
  payment_status: string;
  created_at: string;
  details: OrderDetail[];
}

interface OrderDetail {
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  total: number;
  product_image: string;
}
const role = localStorage.getItem("role");
export default function OrderListAdmin() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [searchOrderCode, setSearchOrderCode] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [payment_statusFilter, setPayment_statusFilter] = useState("all");

    const applyFilters = () => {
        let filtered = orders;

        if (statusFilter !== "all") {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        if (payment_statusFilter !== "all") {
            filtered = filtered.filter(order => order.payment_status === payment_statusFilter);
        }

        if (searchOrderCode.trim() !== "") {
            filtered = filtered.filter(order =>
            order.order_code.toLowerCase().includes(searchOrderCode.toLowerCase())
            );
        }

        setFilteredOrders(filtered);
    };
    useEffect(() => {
        applyFilters();
    }, [orders, searchOrderCode, statusFilter, payment_statusFilter]);

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [editableDetails, setEditableDetails] = useState<OrderDetail[]>([]);
    const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
    const [showDialogEdit, setShowDialogEdit] = useState(false);

    const [showStatusDialog, setShowStatusDialog] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');

    const [showPaymenDialog, setShowPaymenDialog] = useState(false);
    const [selectedPaymen, setSelectePaymen] = useState('');

    const handleQuantityChange = (index: number, delta: number) => {
        setEditableDetails((prev) => {
            const updated = [...prev];
            const item = updated[index];

            const newQuantity = item.quantity + delta;
            if (newQuantity < 1) return prev;

            updated[index] = {
            ...item,
            quantity: newQuantity,
            total: newQuantity * item.product_price,
            };
            return updated;
        });
    };
    const handleRemoveItem = (index: number) => {
        setEditableDetails((prevDetails) => prevDetails.filter((_, i) => i !== index));
    };

    const handleSaveChanges = async () => {
        if (!currentOrderId) return;
        try {
            await axios.post(`${BASE_URL}/Order/updateDetails`, {
            orderId: currentOrderId,
            details: editableDetails,
            });

            toast.success("Cập nhật chi tiết đơn hàng thành công!");
            setShowDialogEdit(false);
            fetchOrders();
        } catch (err) {
            console.error("Lỗi khi cập nhật chi tiết đơn hàng:", err);
            toast.error("Cập nhật thất bại");
        }
    };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Order/getOrders`);
      setOrders(response.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", err);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý đơn hàng</h1>
      </div>

      <div className="mb-6 p-4 bg-white rounded-lg shadow border border-gray-100">
        <h3 className="text-lg font-medium mb-4">Bộ lọc đơn hàng</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mã đơn hàng</label>
            <input
              type="text"
              placeholder="Nhập mã đơn"
              value={searchOrderCode}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              onChange={(e) => {
                setSearchOrderCode(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái đơn</label>
            <select
              value={statusFilter}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              onChange={(e) => {
                setStatusFilter(e.target.value);
              }}
            >
              <option value="all">Tất cả</option>
              <option value="pending">Đang chờ</option>
              <option value="processing">Đang xử lý</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái thanh toán</label>
            <select
              value={payment_statusFilter}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              onChange={(e) => {
                setPayment_statusFilter(e.target.value);
              }}
            >
              <option value="all">Tất cả</option>
              <option value="pending">Chưa thanh toán</option>
              <option value="completed">Đã thanh toán</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {filteredOrders.map((order) => (
          <div key={order.id} className="rounded-xl p-6 bg-white shadow-lg border border-gray-100">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">Đơn Hàng {order.order_code}</h3>
                <h4 className="text-base font-semibold text-gray-800">{order.customer_name}</h4>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{order.phone}</span>
                </div>
                {order.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{order.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{order.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Ngày cưới: {order.wedding_date}</span>
                </div>
                {order.note && (
                  <div className="flex items-start gap-2 text-gray-600">
                    <svg className="w-4 h-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Ghi chú: {order.note}</span>
                  </div>
                )}
              </div>
              <div className="text-right space-y-2">
                <p className="text-xl font-bold text-pink-600">{order.total_price.toLocaleString()}đ</p>
                <p className="capitalize">
                  Trạng thái: 
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`} onClick={() => {
                        setShowStatusDialog(true);
                        setSelectedStatus(order.status);
                        setCurrentOrderId(order.id);
                    }}>
                    {order.status}
                  </span>
                </p>
                <p className="capitalize">
                  Thanh Toán: 
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${
                    order.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`} onClick={() => {
                        setShowPaymenDialog(true);
                        setSelectePaymen(order.payment_status);
                        setCurrentOrderId(order.id);
                    }}>
                    {order.payment_status}
                  </span >
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 my-4"></div>

            <div className="mt-4">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white"
                    onClick={() => {
                        setSelectedOrder(order);
                        setEditableDetails(order.details);
                        setCurrentOrderId(order.id);
                        setShowDialogEdit(true);
                    }}>
                    Chi tiết sản phẩm
                  </Button>
              
            </div>
          </div>
        ))}
      </div>
    <Dialog open={showDialogEdit} onOpenChange={setShowDialogEdit}>
        <DialogContent className="sm:max-w-[800px] ">
            <DialogHeader>
                <DialogTitle>Chi tiết đơn hàng #{selectedOrder?.order_code}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Chi tiết sản phẩm</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
                    {editableDetails.map((item, idx) => (
                    <div key={idx} className="border border-gray-200 p-3 rounded-lg flex gap-4 items-center hover:bg-gray-50 transition-colors relative">
                        <button className={`absolute top-2 right-2 text-gray-400 hover:text-red-500 ${role==="staff" && "hidden"}`}
                            onClick={() => handleRemoveItem(idx)}>
                            <X className="w-5 h-5" />
                        </button>
                        <img 
                            src={item.product_image} 
                            alt={item.product_name} 
                            className="w-24 h-24 object-cover rounded-lg shadow-sm" 
                        />
                        <div className="flex-1">
                            <p className="font-medium text-gray-800">{item.product_name}</p>
                            <div className="flex justify-between mt-2 text-sm text-gray-600">
                              <span>Đơn giá: {item.product_price.toLocaleString()}đ</span>
                              <div className="flex items-center gap-2">
                                <button className={`w-6 h-6 flex items-center justify-center border rounded-md hover:bg-gray-100 ${role==="staff" && "hidden"}`}
                                    onClick={() => handleQuantityChange(idx, -1)}>
                                    <Minus className="w-3 h-3" />
                                </button>
                                <span>{item.quantity}</span>
                                <button className={`w-6 h-6 flex items-center justify-center border rounded-md hover:bg-gray-100 ${role==="staff" && "hidden"}`}
                                    onClick={() => handleQuantityChange(idx, 1)}>
                                    <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <p className="mt-1 font-semibold text-pink-600">
                              Thành tiền: {item.total.toLocaleString()}đ
                            </p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
                <DialogFooter>
                    <Button type="button" variant="outline">
                        Đóng
                    </Button>
                    <Button type="button" className="bg-pink-600 hover:bg-pink-700" onClick={()=>handleSaveChanges()}>
                        Lưu thay đổi
                    </Button>
                </DialogFooter>
            </DialogContent>
    </Dialog>
    <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Trạng thái
                    </label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    >
                        <option value="pending">Đang chờ</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                </div>
            </div>
            <DialogFooter>
                <Button 
                    type="button" 
                    className="bg-pink-600 hover:bg-pink-700"
                    onClick={async () => {
                        try {
                          await axios.post(`${BASE_URL}/Order/updateStatus`, {
                            orderId: currentOrderId,
                            status: selectedStatus
                          });
                          toast.success("Cập nhật trạng thái thành công!");
                          setShowStatusDialog(false);
                          fetchOrders();
                        } catch (err) {
                          console.error("Lỗi khi cập nhật trạng thái:", err);
                          toast.error("Cập nhật thất bại");
                        }
                      }}
                    >
                    Lưu thay đổi
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    <Dialog open={showPaymenDialog} onOpenChange={setShowPaymenDialog}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Trạng thái
                    </label>
                    <select
                        value={selectedPaymen}
                        onChange={(e) => setSelectePaymen(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    >
                        <option value="pending">Chưa Thanh Toán</option>
                        <option value="completed">Đã Thanh Toán</option>
                    </select>
                </div>
            </div>
            <DialogFooter>
                <Button 
                    type="button" 
                    className="bg-pink-600 hover:bg-pink-700"
                    onClick={async () => {
                        try {
                          await axios.post(`${BASE_URL}/Order/updatePayment`, {
                            orderId: currentOrderId,
                            payment_status: selectedPaymen
                          });
                          toast.success("Cập nhật thanh toán thành công!");
                          setShowPaymenDialog(false);
                          fetchOrders();
                        } catch (err) {
                          console.error("Lỗi khi cập nhật thanh toán:", err);
                          toast.error("Cập nhật thất bại");
                        }
                      }}
                    >
                    Lưu thay đổi
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </div>
  );
}