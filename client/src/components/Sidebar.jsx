"use client";

import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isSidebarVisible, toggleSidebar }) => {
  return (
    <div
      className={`h-screen bg-white shadow-md transition-all duration-300 ${
        isSidebarVisible ? "w-64" : "w-16"
      } flex flex-col relative`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b flex justify-between items-center relative">
        <span
          className={`text-lg font-bold transition-opacity duration-300 ${
            isSidebarVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          Admin
        </span>
        
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-gray-900 focus:outline-none text-3xl"
          style={{
            left: isSidebarVisible ? "auto" : "50%",
            right: isSidebarVisible ? "1rem" : "auto",  // Adjusted to move more to the right when expanded
            transform: isSidebarVisible ? "translateY(-50%)" : "translateX(-50%) translateY(-50%)",
          }}
        >
          {isSidebarVisible ? "<<" : ">>"}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className={`block p-4 hover:bg-gray-200 text-black transition-all ${
                isSidebarVisible ? "text-left" : "text-center"
              }`}
            >
              {isSidebarVisible ? "Dashboard Overview" : "🏠"}
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/competitions"
              className={`block p-4 hover:bg-gray-200 text-black transition-all ${
                isSidebarVisible ? "text-left" : "text-center"
              }`}
            >
              {isSidebarVisible ? "Competitions" : "🏆"}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
