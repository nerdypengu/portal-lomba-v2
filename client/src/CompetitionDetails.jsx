"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge, Button } from "flowbite-react";
import './App.css';

const CompetitionDetails = () => {
  const { id } = useParams();
  const [competition, setCompetition] = useState(null);

  useEffect(() => {
    const mockCompetitions = [
        { id: 1, name: "Competition A", type: "Science", status: "Open", startDate: "2024-12-01", endDate: "2024-12-31", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed viverra diam sed massa porttitor, eu dapibus nisl pulvinar. Aliquam condimentum mauris id velit posuere, at scelerisque elit euismod. Donec blandit odio nec lorem tempor, fringilla commodo felis cursus. Morbi maximus libero eros, et tincidunt elit hendrerit et. Sed at tempor odio. Cras quis accumsan elit. Nulla a orci rutrum, tristique mauris in, finibus tellus. Donec lobortis nibh rutrum, commodo mauris et, tincidunt nunc. In enim nisi, elementum sed nibh sit amet, congue ornare turpis. Proin a aliquam eros. In hendrerit ornare nunc, in sodales augue rutrum eu. Donec quis pretium sem, nec aliquet felis. Nunc sed quam mollis, porttitor velit nec, placerat elit." },
        { id: 2, name: "Competition B", type: "Art", status: "Closed", startDate: "2024-10-01", endDate: "2024-10-15", description: "Description of Competition B" },
        { id: 3, name: "Competition C", type: "Math", status: "Open", startDate: "2024-12-05", endDate: "2024-12-20", description: "Description of Competition C" },
        { id: 4, name: "Competition D", type: "Coding", status: "Closed", startDate: "2024-09-10", endDate: "2024-09-30", description: "Description of Competition D" },
        { id: 5, name: "Competition E", type: "Design", status: "Open", startDate: "2024-11-15", endDate: "2024-11-30", description: "Description of Competition E" },
    ];
    const competitionDetails = mockCompetitions.find((comp) => comp.id === parseInt(id, 10));
    setCompetition(competitionDetails);
  }, [id]);

  if (!competition) {
    return <p>Loading competition details...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">{competition.name}</h1>

      {/* Table Layout */}
      <table className="table-auto w-full">
        <tbody>
          <tr className="flex">

            {/* Left: Poster Image with Hover Zoom */}
            <td className="w-1/4">
              <a href="/lomba-1.jpg" target="_blank" rel="noopener noreferrer">
                <img
                  src="/lomba-1.jpg"
                  alt={competition.name}
                  className="h-full max-w-xs transition-transform duration-500 transform hover:scale-110"
                />
              </a>
            </td>

            {/* Center: Description and Dates */}
            <td className="w-2/4 p-4 pl-8 flex flex-col">
              <div className="mt-2 flex gap-4 items-center">
                {/* Category Badge */}
                <Badge color="info" size="xl" className="text-left">{competition.type}</Badge>
                {/* Status Badge */}
                <Badge color={competition.status === "Open" ? "success" : "warning"} size="xl" className="text-left">{competition.status}</Badge>
              </div>
              
              {/* Start and End Date with larger text */}
              <p className="mt-4 text-left text-2xl font-bold">{`Start: ${competition.startDate} | End: ${competition.endDate}`}</p>
              
              {/* Theme Under Dates */}
              <p className="mt-4 text-left text-2xl font-bold">Theme: {competition.type}</p>

              {/* Description */}
              <p className="font-normal text-gray-700 mt-4 text-left">{competition.description}</p>
            </td>

            {/* Right: Buttons (Register, Guidebook) */}
            <td className="w-1/3 p-4 flex flex-col items-start ml-auto">
              <Button href="#" className="w-full mb-2">Register</Button>
              <Button href="#" className="w-full">Guidebook</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CompetitionDetails;
