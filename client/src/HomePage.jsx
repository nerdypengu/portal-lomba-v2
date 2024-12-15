"use client";

import React, { useState, useEffect } from "react";
import { Card, Badge, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import "./App.css";

const HomePage = () => {
  const [competitions, setCompetitions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/competitions/all");
        const result = await response.json();
        console.log(result);
        if (response.ok && result.data) {
          const transformedCompetitions = result.data.map((item) => ({
            id: item.Id,
            name: item.Nama,
            tags: item.Tags.split(","),
            status: item.Status,
            startDate: item["Start Regist"],
            endDate: item["End Regist"],
            image: item["Image LInk"]
          }));
          setCompetitions(transformedCompetitions);
        } else {
          console.error("Failed to fetch competitions:", result);
        }
      } catch (error) {
        console.error("Error fetching competitions:", error);
      }
    };

    fetchCompetitions();
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

        {/* Flexbox Layout */}
        <div className="flex flex-wrap justify-center gap-4">
          {filteredCompetitions.length > 0 ? (
            filteredCompetitions.map((competition) => (
              <div
                key={competition.id}
                className="flex-none sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1rem)]"
              >
                <Card className="max-w-sm" horizontal>
                <iframe src={competition.image}></iframe>
                  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-left">
                    {competition.name}
                  </h5>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {/* Tags as Badges */}
                    {competition.tags.map((tag, index) => (
                      <Badge key={index} color="info">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {/* Status Badge */}
                    <Badge color={competition.status === "Open" ? "success" : "warning"}>
                      {competition.status}
                    </Badge>
                  </div>
                  <p className="font-normal text-gray-700 dark:text-gray-400 mt-2">
                    Start: {competition.startDate} | End: {competition.endDate}
                  </p>
                  <Link to={`/competition-details/${competition.month}/${competition.id}`}>
                    <Button className="mt-4">Learn More</Button>
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
