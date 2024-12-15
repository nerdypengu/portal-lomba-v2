"use client";

import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DashboardOverview from "./components/DashboardOverview";
import CompetitionsManagement from "./components/CompetitionManagement";

const DashboardPage = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        isSidebarVisible={isSidebarVisible}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarVisible ? "ml-64" : "ml-16"
        } p-6 bg-gray-100`}
      >
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/competitions" element={<CompetitionsManagement />} />
        </Routes>
      </div>
    </div>
  );
};


export default DashboardPage;
