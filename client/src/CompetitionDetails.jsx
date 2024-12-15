"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Badge, Button } from "flowbite-react";

const CompetitionDetails = () => {
  const { sheetName, id } = useParams(); // Extract 'sheetName' and 'id' from the route parameters

  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompetitionDetails = async () => {
      if (!id || !sheetName) {
        setError("Invalid competition details.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/competitions/${sheetName}/${id}`);
        const result = await response.json();

        if (response.ok) {
          setCompetition(result.data);
        } else {
          setError(result.error || "Failed to fetch competition details.");
        }
      } catch (err) {
        setError("An error occurred while fetching competition details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitionDetails();
  }, [id, sheetName]);

  if (loading) {
    return <p>Loading competition details...</p>;
  }

  if (error) {
    return <p className="text-red-600 font-semibold">{error}</p>;
  }

  // Validate Image URL
  const isValidIframeSrc = (url) => url && url.startsWith("https://drive.google.com");

  return (
    <div className="flex flex-col min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">{competition?.Nama}</h1>

      <div className="flex flex-col md:flex-row">
        {/* Poster Image */}
        <div className="flex-1 mb-4 md:mb-0">
          {isValidIframeSrc(competition?.["Image LInk"]) ? (
            <iframe
              src={competition["Image LInk"]}
              width="80%"
              allow="autoplay"
              className="rounded-lg"
            ></iframe>
          ) : (
            <p className="text-red-500">Invalid poster URL</p>
          )}
        </div>

        {/* Details Section */}
        <div className="flex-1 pl-4">
          <div className="mt-2 flex gap-2 flex-wrap">
            {/* Tags as Badges */}
            {competition?.Tags?.split(",").map((tag, index) => (
              <Badge key={index} color="info">
                {tag}
              </Badge>
            ))}
          </div>
          <p className="font-bold mt-4">Status:</p>
            <div className="flex justify-center mt-2">
              <Badge
                  color={competition?.Status === "Open" ? "success" : "warning"}
                  className="text-center"
              >
                {competition?.Status}
              </Badge>
            </div>

          <p className="mt-4">
            <strong>Start Date:</strong> {competition?.["Start Regist"]}
          </p>
          <p>
            <strong>End Date:</strong> {competition?.["End Regist"]}
          </p>
          <p className="mt-4">
            <strong>Description:</strong>
          </p>
          <p className = "mt-4">
            {competition?.Description}
          </p>

          {/* Buttons */}
          <div className="mt-4">
            <Button
              href={competition?.["Link Guidebook"] || "#"}
              target="_blank"
              rel="noopener noreferrer"
              disabled={!competition?.["Link Guidebook"]}
              className="mb-2 w-full"
            >
              Guidebook
            </Button>
            <Button
              href={competition?.["Link Pendaftaran"] || "#"}
              target="_blank"
              rel="noopener noreferrer"
              disabled={!competition?.["Link Pendaftaran"]}
              className="w-full"
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionDetails;
