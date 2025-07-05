import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronUp,FaChevronDown  } from "react-icons/fa6";



interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  closeMobileSidebar: () => void;
}

export default function Sidebar({isCollapsed,isMobileOpen,closeMobileSidebar,}: SidebarProps) {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
     {/* Desktop sidebar */}
    <div className={
        "group px-4 hidden h-screen bg-white shadow transition-all duration-300 md:block border " +
        (isCollapsed ? "w-20 hover:w-64" : "w-64")
      }
    >
      <div className="px-2 py-8 text-xl font-bold whitespace-nowrap overflow-hidden transition-all ">
        <span className="text-xl">#</span>
        <span
          className={"overflow-hidden whitespace-nowrap transition-all duration-300 "+
              (isCollapsed ? "w-0 opacity-0 group-hover:w-auto group-hover:opacity-100 pl-2" : "w-auto pl-2 opacity-100")}
          >
          Tailmin
        </span>
      </div>

      <span className={"block text-gray-500 text-sm mb-4 transition-all duration-300 "}>
        Menu
      </span>

      <ul className="space-y-2 font-timesnewroman [&>li]:p-2 [&>li]:text-lg">
          <li className="hover:bg-gray-100 cursor-pointer rounded-md flex items-center transition-all">
            <span className="text-xl">📊</span>
            <span
              className={"overflow-hidden whitespace-nowrap transition-all duration-300 "+
                (isCollapsed ? "w-0 opacity-0 group-hover:w-auto group-hover:opacity-100 pl-2" : "w-auto pl-2 opacity-100")}
            >
              Dashboard
            </span>
          </li>
          <li className="hover:bg-gray-100 cursor-pointer rounded-md flex items-center transition-all">
            <span className="text-xl">📅</span>
            <span
              className={"overflow-hidden whitespace-nowrap transition-all duration-300 "+
                (isCollapsed ? "w-0 opacity-0 group-hover:w-auto group-hover:opacity-100 pl-2" : "w-auto pl-2 opacity-100")}
            >
              Calendar
            </span>
          </li>
          <li className="hover:bg-gray-100 cursor-pointer rounded-md flex items-center transition-all">
            <span className="text-xl">📊</span>
            <span
              className={"overflow-hidden whitespace-nowrap transition-all duration-300 "+
                (isCollapsed ? "w-0 opacity-0 group-hover:w-auto group-hover:opacity-100 pl-2" : "w-auto pl-2 opacity-100")}
            >
              Dashboard
            </span>
          </li>
          <li className="hover:bg-gray-100 cursor-pointer rounded-md flex items-center transition-all">
            <span className="text-xl">📊</span>
            <span
              className={"overflow-hidden whitespace-nowrap transition-all duration-300 "+
                (isCollapsed ? "w-0 opacity-0 group-hover:w-auto group-hover:opacity-100 pl-2" : "w-auto pl-2 opacity-100")}
            >
              Dashboard
            </span>
          </li>
          <li className="hover:bg-gray-100 cursor-pointer rounded-md flex items-center transition-all" onClick={() => setIsOpen(!isOpen)}>
            <span className="text-xl">📊</span>
            <span
              className={"overflow-hidden whitespace-nowrap transition-all duration-300 flex items-center gap-3 "+
                (isCollapsed ? "w-0 opacity-0 group-hover:w-auto group-hover:opacity-100 pl-2" : "w-auto pl-2 opacity-100")}
            >
              Sản Phẩm {isOpen ? <FaChevronUp size={20}  color="gray"/> : <FaChevronDown size={20} color="gray"/>}
            </span>
          </li>
            {isOpen && (
              <ul className={"ml-7 space-y-1 transition-all duration-300 " + (isCollapsed ? "w-0 h-0 opacity-0 group-hover:w-auto group-hover:h-auto group-hover:opacity-100 pl-2" : "w-auto pl-2 opacity-100")}>
                  <Link to={"/admin/ProductAdmin"}>
                    <li
                      className="text-base hover:bg-gray-200 rounded px-2 py-1 cursor-pointer whitespace-nowrap "
                    >Sản Phẩm
                    </li>
                  </Link>
                  <Link to={"/admin/CategoryAdmin"}>
                    <li
                      className="text-base hover:bg-gray-200 rounded px-2 py-1 cursor-pointer whitespace-nowrap "
                    >Danh Mục
                    </li>
                  </Link>
              </ul>
            )}
      </ul>
    </div>


      {/* Mobile sidebar (drawer) */}
      <div
        className={
          "fixed inset-0 z-50 flex md:hidden transition-opacity duration-300 " +
          (isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none")
        }
      >
        {/* Sidebar sliding panel */}
        <div
          className={
            "h-full w-64 bg-white p-5 shadow-lg transform transition-transform duration-300 ease-in-out " +
            (isMobileOpen ? "translate-x-0" : "-translate-x-full")
          }
        >
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-800">TailAdmin</span>
            <button
              onClick={closeMobileSidebar}
              className="text-xl text-gray-600 hover:text-red-500 transition"
            >
              ❌
            </button>
          </div>

          {/* Navigation */}
          <ul className="space-y-3 font-[Times_New_Roman] text-base text-gray-700">
            <li className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition">
            <span className="text-xl">📊</span>
            <span >Dashboard</span>
          </li>
          <li className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition">
            <span className="text-xl">📅</span>
            <span>Calendar</span>
          </li>
          <li className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition">
            <span className="text-xl">📊</span>
            <span>
              Dashboard
            </span>
          </li>
          <li className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition">
            <span className="text-xl">📊</span>
            <span>
              Dashboard
            </span>
          </li>
          <li className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition" onClick={() => setIsOpen(!isOpen)}>
            <span className="text-xl">📊</span>
            <span className="flex items-center gap-2">
              Sản Phẩm {isOpen ? <FaChevronUp size={20}  color="gray"/> : <FaChevronDown size={20} color="gray"/>}
            </span>
          </li>
            {isOpen && (
              <ul className={"ml-7 space-y-1 transition-all duration-300 "}>
                <Link to={"/admin/ProductAdmin"}>
                  <li
                    className="text-sm hover:bg-gray-200 rounded px-2 py-1 cursor-pointer"
                  >Sản Phẩm
                  </li>
                </Link>
                <Link to={"/admin/CategoryAdmin"}>
                  <li
                    className="text-sm hover:bg-gray-200 rounded px-2 py-1 cursor-pointer"
                  >Danh Mục
                  </li>
                </Link>
              </ul>
            )}       
          </ul>
        </div>

        {/* Overlay */}
        <div
          className="flex-1 bg-black bg-opacity-40"
          onClick={closeMobileSidebar}
        ></div>
      </div>


    </>
  );
}
