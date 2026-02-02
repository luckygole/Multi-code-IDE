import React from "react";
import { motion } from "framer-motion";

const Nopage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0e0e] text-white px-4">
      
      {/* Animated Emoji */}
      <motion.div
        initial={{ scale: 0.8, rotate: 0 }}
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="text-6xl mb-4"
      >
        😅
      </motion.div>

      {/* 404 Heading */}
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-5xl font-bold text-red-500"
      >
        404 - Page Not Found
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-gray-400 text-lg mt-3 text-center max-w-md"
      >
        Oops! Looks like you took a wrong turn. The page you’re looking for doesn’t exist — but don’t worry, you can always go back home.
      </motion.p>

      {/* Go Home Button */}
      <motion.a
        href="/"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 bg-blue-600 hover:bg-blue-700 transition-all text-white px-6 py-2 rounded-lg shadow-lg"
      >
        Go Back Home
      </motion.a>
    </div>
  );
};

export default Nopage;