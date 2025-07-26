import { useEffect, useState } from 'react';
import { FaCalendarAlt,FaMoneyBillWave} from 'react-icons/fa';
import { BASE_URL } from '../../../link';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface OrderStatusStat {
  status: string; // "Chưa xử lý" | "Đang xử lý" | "Đã xử lý"
  count: number;
  percentage: number;
}

export interface OrderStatsResponse {
  total: number;
  totalCompleted:number;
  price: number;
  stats: OrderStatusStat[];
}

export interface OrderSummary {
  order_code: string;
  customer_name: string;
  total_price: number;
  status: string;
  created_at: string;
}

export interface CategoryStats {
  name: string;
  count: number;
  total: number;
  percentage: number;
}


const Dashboard = () => {
const [stats, setStats] = useState<OrderStatsResponse | null>(null);
const [orderSummary, setOrderSummary] = useState<OrderSummary[]>([]);
const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);

const fetchOrderStats = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/Order/getOrderStats`);
    if (res.data.success) {
      setStats(res.data.data); // data: { total, stats }
    } else {
      toast.error(res.data.message || "Không tìm thấy nội dung");
    }
  } catch (err) {
    console.error("Lỗi khi gọi API:", err);
    toast.error("Lỗi máy chủ");
  }
};
const fetchOrderSummary = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/Order/getOrderSummary`);
    if (res.data.success) {
      setOrderSummary(res.data.data);
    } else {
      toast.error(res.data.message || "Không tìm thấy nội dung");
    }
  } catch (err) {
    console.error("Lỗi khi gọi API:", err);
    toast.error("Lỗi máy chủ");
  }
};
const fetchCategoryStats = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/Order/getCategoryStats`);
    if (res.data.success) {
      setCategoryStats(res.data.data);
    } else {
      toast.error("Không thể lấy thống kê danh mục");
    }
  } catch (err) {
    console.error("Lỗi khi gọi API:", err);
    toast.error("Lỗi máy chủ");
  }
};

useEffect(() => {
  fetchOrderStats();
  fetchOrderSummary();
  fetchCategoryStats();
}, []);



  return (
    <div className="flex h-screen bg-gray-50">

      {/* Main Content */}
      <div className="flex-1">


        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Xin Chào</h1>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* {bookingStats.map((stat, index) => (
              <div key={index} className={`bg-gradient-to-r ${stat.color} rounded-xl p-6 text-white shadow-sm`}>
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm opacity-80">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-sm mt-2">{stat.percentage} of total bookings</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full p-3 h-12 w-12 flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))} */}
            {stats?.stats.map((stat, index) => (
              <div key={index} className={`rounded-xl p-6 text-white shadow-sm bg-gradient-to-r 
                ${stat.status === 'completed' ? 'from-emerald-500 to-emerald-600' : stat.status === 'processing'? 'from-amber-500 to-amber-600' :'from-rose-500 to-rose-600'} `}
                >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm opacity-80">{stat.status}</p>
                    <p className="text-2xl font-bold mt-1">{stat.count}</p>
                    <p className="text-sm mt-2">{stat.percentage} % of total bookings</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full p-3 h-12 w-12 flex items-center justify-center">
                    <FaCalendarAlt className="text-white text-xl" />
                  </div>
                </div>
              </div>
            ))}
            
            {/* Total Revenue Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold mt-1">
                    {stats?.price
                      ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(stats.price)
                      : "0 ₫"}
                  </p>
                  <p className="text-sm mt-2">{stats?.totalCompleted} bookings completed</p>
                </div>
                <div className="bg-purple-100 rounded-full p-3 h-12 w-12 flex items-center justify-center">
                  <FaMoneyBillWave className="text-purple-600 text-xl" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-6">
            <div className="w-full xl:w-[76%] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Most Popular Packages</h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categoryStats.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {/* <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            {product.icon}
                          </div> */}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.count}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product?.total
                          ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.total)
                          : "0 ₫"}
                      </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-emerald-600">{product.percentage}%</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
            <div className="w-full xl:w-[24%] bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Recent Bookings</h3>
                <button className="text-sm text-purple-600 hover:text-purple-800">View All</button>
              </div>
              <div className="space-y-4">
                {orderSummary.slice(0,5).map((booking, index) => (
                  <div key={index} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{booking.customer_name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(booking.created_at).toLocaleDateString("vi-VN")}
                      </p>
                      <p className="text-xs text-gray-500">{booking.order_code}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">$
                        {stats?.price ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(stats.price) : "0 ₫"}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                        booking.status === 'processing' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Popular Products */}
          
        </main>
      </div>
    </div>
  );
};

export default Dashboard;