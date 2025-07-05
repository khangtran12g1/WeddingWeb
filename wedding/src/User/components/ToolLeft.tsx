function ToolLeft (){
    return(
        <>
         <div className="fixed top-1/3 right-2 z-50 flex flex-col gap-3 items-center p-2 bg-white border border-yellow-400 rounded-xl shadow-md">
            <a href="tel:0967784511" className="flex flex-col items-center hover:opacity-80">
                <img src="/icon/phone.png" alt="Hotline" className="w-10 h-10" />
                <span className="text-xs text-gray-700 font-semibold">Hotline</span>
            </a>

            <a
                href="https://www.google.com/maps?q=phu+thê+wedding"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center hover:opacity-80"
            >
                <img src="/icon/map.png" alt="Tìm đường" className="w-10 h-10" />
                <span className="text-xs text-gray-700 font-semibold">Tìm đường</span>
            </a>

            <a
                href="https://zalo.me/0354471556"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center hover:opacity-80"
            >
                <img src="/icon/zalo.png" alt="Chat Zalo" className="w-10 h-10" />
                <span className="text-xs text-gray-700 font-semibold">Chat Zalo</span>
            </a>

            <a
                href="https://m.me/phuthewedding"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center hover:opacity-80"
            >
                <img src="/icon/messenger.png" alt="Messenger" className="w-10 h-10" />
                <span className="text-xs text-gray-700 font-semibold">Messenger</span>
            </a>
            
      </div>
        </>
    )
}
export default ToolLeft;