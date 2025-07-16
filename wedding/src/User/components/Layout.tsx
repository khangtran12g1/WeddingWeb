import Header from "./Header";
import Footer from "./Footer";
import ToolLeft from "./ToolLeft";
import {CartProvider }from "./CartContext";
import { Outlet } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
function Layout() {
  return (
    <CartProvider>
      <Toaster />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-white"><Outlet/></main>
        <ToolLeft/>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default Layout;
