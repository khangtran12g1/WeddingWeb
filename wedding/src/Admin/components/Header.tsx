
import { LuSquareMenu } from "react-icons/lu";

export default function Header({toggleSidebar,toggleMobileSidebar}: 
                              {toggleSidebar: () => void; toggleMobileSidebar: () => void;}) {
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
      <div className="flex items-center gap-4">
        <span>🔔</span>
        <img
          src="https://i.pravatar.cc/40"
          className="rounded-full w-8 h-8"
          alt="user"
        />
      </div>
    </div>
  );
}
