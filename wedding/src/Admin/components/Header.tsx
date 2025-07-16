
import { LuSquareMenu } from "react-icons/lu";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Header({toggleSidebar,toggleMobileSidebar}: 
                              {toggleSidebar: () => void; toggleMobileSidebar: () => void;}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    
    <div className="bg-white shadow px-4 py-7 flex items-center justify-between border">
      <button
        onClick={toggleSidebar}
        className="text-xl hidden md:block"
      >
        <LuSquareMenu size={32} color="gray"/>
      </button>
      <button
        onClick={toggleMobileSidebar}
        className="text-xl md:hidden"
      >
        <LuSquareMenu size={32} color="gray"/>
      </button>
      <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span>🔔</span>
        <img
          src="https://i.pravatar.cc/40"
          className="rounded-full w-8 h-8"
          alt="user"
        />
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <ul className="py-2">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Tài khoản</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Cài đặt</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
            onClick={()=>{localStorage.removeItem("token"); localStorage.removeItem("role");navigate("/login");}}>Đăng xuất</li>
          </ul>
        </div>
      )}
    </div>
    </div>
  );
}
