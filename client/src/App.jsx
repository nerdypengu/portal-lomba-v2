"use client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import HomePage from "./HomePage";
import CompetitionDetails from "./CompetitionDetails";
import LoginPage from "./LoginPage";
import DashboardPage from "./DashboardPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/competition-details/:sheetName/:id" element={<CompetitionDetails />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard/*" element={<DashboardPage />} />
      </Routes>
      <Analytics />
    </Router>
  );
};

export default App;
