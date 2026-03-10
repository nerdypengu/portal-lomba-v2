"use client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
    </Router>
  );
};

export default App;
