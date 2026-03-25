import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#0d0d0d] text-gray-400 py-8 border-t border-gray-800 mt-28">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-4">

        {/* Top Line */}
        {/* <div className="flex flex-wrap justify-between items-center">
          <h3 className="text-white font-semibold text-lg">Kode Base</h3>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white">Home</a>
            <a href="#" className="hover:text-white">Features</a>
            <a href="#" className="hover:text-white">About</a>
            <a href="#" className="hover:text-white">Support</a>
          </div>
        </div> */}

        {/* Description */}
        <p className="text-sm text-gray-400 text-center">
          Manage and store your projects easily with a clean and powerful interface.
        </p>

        {/* Bottom Line */}
        <p className="text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} MultiCode-IDE — Made by Lucky gole
        </p>
      </div>
    </footer>
  );
};

export default Footer;