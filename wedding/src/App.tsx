import Layout from "./User/components/Layout";
import Home from "./User/pages/Home";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Products from "./User/pages/Product";
import ProductDetail from "./User/pages/ProductDetail";
import Introduce from "./User/pages/introduce";
import ScrollToTop from "./User/components/ScrollToTop";
import LienHe from "./User/pages/LienHe";
import ThuVienAnh from "./User/pages/ThuVienAnh";
import ThuVienAnhDetails from "./User/pages/ThuVienAnhDetails";
import Cart from "./User/pages/Cart";
import Order from "./User/pages/Order";
import ThankYou from "./User/pages/ThankYou";

import LayoutAdmin from "./Admin/components/AdminLayout";
import Dashboard from "./Admin/pages/Dashboard";
import ProductAdmin from "./Admin/pages/Product";
import CategoryAdmin from "./Admin/pages/Category";
import AboutAdmin from "./Admin/pages/About";
import GalleryImagesAdmin from "./Admin/pages/GalleryImages";
import OrderListAdmin from "./Admin/pages/OrderList";
import Login from "./Admin/pages/Login";
import PrivateRoute from "./Admin/components/PrivateRoute ";
import UserAdmin from "./Admin/pages/UserAdmin";
import HomeGioiThieu from "./Admin/pages/HomeGioiThieu";
import HomeLiDo from "./Admin/pages/HomeLiDo";
import HomeVideo from "./Admin/pages/HomeVideo";
import ContactAdmin from "./Admin/pages/ContactAdmin";
import Unauthorized from "./Admin/pages/Unauthorized";


function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Layout user */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/ChiTietSanPham/:id" element={<ProductDetail />} />
          <Route path="/DanhSachSanPham" element={<Products />} />
          <Route path="/GioiThieu" element={<Introduce />} />
          <Route path="/lien-he" element={<LienHe />} />
          <Route path="/ThuVienAnh" element={<ThuVienAnh />} />
          <Route path="/ThuVienAnhDetails/:id" element={<ThuVienAnhDetails />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Order" element={<Order />} />
          <Route path="/ThankYou" element={<ThankYou />} />
        </Route>


        <Route path="/admin" element={<LayoutAdmin/>}>
          <Route index element={<PrivateRoute allowedRoles={["admin"]}> <Dashboard /></PrivateRoute>} />
          <Route path="Dashboard" element={<PrivateRoute allowedRoles={["admin"]}><Dashboard /></PrivateRoute>} />
          <Route path="ProductAdmin" element={<PrivateRoute allowedRoles={["admin", "staff"]}><ProductAdmin /></PrivateRoute>} />
          <Route path="CategoryAdmin" element={<PrivateRoute allowedRoles={["admin", "staff"]}><CategoryAdmin /></PrivateRoute>} />
          <Route path="AboutAdmin" element={<PrivateRoute allowedRoles={["admin", "staff"]}><AboutAdmin /></PrivateRoute>} />
          <Route path="GalleryImagesAdmin" element={<PrivateRoute allowedRoles={["admin", "staff"]}><GalleryImagesAdmin /></PrivateRoute>} />
          <Route path="OrderListAdmin" element={<PrivateRoute allowedRoles={["admin", "staff"]}><OrderListAdmin /></PrivateRoute>} />
          <Route path="UserAdmin" element={<PrivateRoute allowedRoles={["admin"]}><UserAdmin /></PrivateRoute>} />
          <Route path="HomeGioiThieu" element={<PrivateRoute allowedRoles={["admin", "staff"]}><HomeGioiThieu /></PrivateRoute>} />
          <Route path="HomeLiDo" element={<PrivateRoute allowedRoles={["admin", "staff"]}><HomeLiDo /></PrivateRoute>} />
          <Route path="HomeVideo" element={<PrivateRoute allowedRoles={["admin", "staff"]}><HomeVideo /></PrivateRoute>} />
          <Route path="ContactAdmin" element={<PrivateRoute allowedRoles={["admin", "staff"]}><ContactAdmin /></PrivateRoute>} />
        </Route>
        <Route path="/Login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

      </Routes>
    </Router>
  );
}

export default App;
