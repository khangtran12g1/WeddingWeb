import Layout from "./User/components/Layout";
import Home from "./User/pages/Home";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Product from "./User/pages/Product";
import ProductDetail from "./User/pages/ProductDetail";
import Introduce from "./User/pages/introduce";
import ScrollToTop from "./User/components/ScrollToTop";
import LienHe from "./User/pages/LienHe";
import ThuVienAnh from "./User/pages/ThuVienAnh";

import LayoutAdmin from "./Admin/components/AdminLayout";
import Dashboard from "./Admin/pages/Dashboard";
import ProductAdmin from "./Admin/pages/Product";
import CategoryAdmin from "./Admin/pages/Category";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Layout user */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/ChiTietSanPham" element={<ProductDetail />} />
          <Route path="/DanhSachSanPham" element={<Product />} />
          <Route path="/GioiThieu" element={<Introduce />} />
          <Route path="/lien-he" element={<LienHe />} />
          <Route path="/ThuVienAnh" element={<ThuVienAnh />} />
        </Route>


        <Route path="/admin" element={<LayoutAdmin/>}>
          <Route index element={<Dashboard />} />
          <Route path="ProductAdmin" element={<ProductAdmin />} />
          <Route path="CategoryAdmin" element={<CategoryAdmin />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
