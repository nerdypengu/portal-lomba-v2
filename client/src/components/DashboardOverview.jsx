"use client";

import { useState, useEffect } from "react";

const DashboardOverview = () => {
  const [competitionCount, setCompetitionCount] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCompetitionsCount = async () => {
      try {
        const response = await fetch(`${API_URL}/api/competitions?year=2024`);
        const result = await response.json();

        if (response.ok) {
          setCompetitionCount(result.data.length); // Assuming `data` is an array of competitions
        } else {
          console.error(result.error || "Failed to fetch competition data.");
        }
      } catch (err) {
        console.error("An error occurred:", err);
      }
    };

    fetchCompetitionsCount();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
      <div className="bg-white shadow p-6 rounded-lg">
        <h3 className="text-lg font-semibold">Competitions This Year</h3>
        <p className="text-4xl font-bold">{competitionCount}</p>
      </div>
    </div>
  );
};

export default DashboardOverview;
