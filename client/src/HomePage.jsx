"use client";

import React, { useState, useEffect } from "react";
import { Card, Badge, Button } from "flowbite-react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./App.css";

const HomePage = () => {
  const [competitions, setCompetitions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const mockCompetitions = [
      { id: 1, name: "Competition A", type: "Science", status: "Open", startDate: "2024-12-01", endDate: "2024-12-31" },
      { id: 2, name: "Competition B", type: "Art", status: "Closed", startDate: "2024-10-01", endDate: "2024-10-15" },
      { id: 3, name: "Competition C", type: "Math", status: "Open", startDate: "2024-12-05", endDate: "2024-12-20" },
      { id: 4, name: "Competition D", type: "Coding", status: "Closed", startDate: "2024-09-10", endDate: "2024-09-30" },
      { id: 5, name: "Competition E", type: "Design", status: "Open", startDate: "2024-11-15", endDate: "2024-11-30" },
    ];
    setCompetitions(mockCompetitions);
  }, []);

  const filteredCompetitions = competitions.filter((competition) =>
    competition.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Competitions</h1>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search competitions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Flexbox Layout (Centered, Wraps when necessary) */}
        <div className="flex flex-wrap justify-center gap-4">
          {filteredCompetitions.length > 0 ? (
            filteredCompetitions.map((competition) => (
              <div
                key={competition.id}
                className="flex-none sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1rem)]"
              >
                <Card className="max-w-sm" imgSrc="lomba-1.jpg" horizontal>
                  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-left">
                    {competition.name}
                  </h5>
                  <div className="mt-2 flex gap-2">
                    {/* Type Badge */}
                    <Badge color="info">{competition.type}</Badge>
                    {/* Status Badge */}
                    <Badge color={competition.status === "Open" ? "success" : "warning"}>
                      {competition.status}
                    </Badge>
                  </div>
                  <p className="font-normal text-gray-700 dark:text-gray-400 mt-2">
                    Start: {competition.startDate} | End: {competition.endDate}
                  </p>
                  <Link to={`/competition-details/${competition.id}`}>
                    <Button className="mt-4">
                      Learn More
                    </Button>
                  </Link>
                </Card>
              </div>
            ))
          ) : (
            <p>No competitions match your search.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
