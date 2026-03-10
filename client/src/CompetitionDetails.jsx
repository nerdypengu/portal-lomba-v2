"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Badge, Button } from "flowbite-react";

const CompetitionDetails = () => {
  const { sheetName, id } = useParams(); // Extract 'sheetName' and 'id' from the route parameters

  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCompetitionDetails = async () => {
      if (!id || !sheetName) {
        setError("Invalid competition details.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/competitions/${sheetName}/${id}`);
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
  }, [id, sheetName, API_URL]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600 font-semibold text-lg">{error}</p>
      </div>
    );
  }

  // Validate Image URL
  const isValidIframeSrc = (url) => url && url.startsWith("https://drive.google.com");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Back Button & Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:text-blue-700 font-semibold mb-4 flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-slate-900">{competition?.Nama}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Poster Image */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              {isValidIframeSrc(competition?.["Image LInk"]) ? (
                <iframe
                  src={competition["Image LInk"]}
                  className="w-full h-96 border-0"
                  title={competition?.Nama}
                ></iframe>
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <p className="text-gray-500 font-semibold">Invalid poster URL</p>
                </div>
              )}
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 h-fit">
            {/* Tags */}
            {competition?.Tags && (
              <div className="mb-6">
                <h3 className="font-bold text-slate-900 mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {competition.Tags.split(",").map((tag, index) => (
                    <Badge key={index} color="info" className="text-xs font-medium">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Status */}
            <div className="mb-6">
              <h3 className="font-bold text-slate-900 mb-2">Status</h3>
              <Badge
                color={competition?.Status === "Open" ? "success" : "failure"}
                className="w-full text-center justify-center font-bold"
              >
                {competition?.Status}
              </Badge>
            </div>

            {/* Dates */}
            <div className="mb-6 space-y-3">
              <div>
                <p className="text-sm text-gray-600 font-medium">Start Registration</p>
                <p className="text-slate-900 font-semibold">{competition?.["Start Regist"]}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">End Registration</p>
                <p className="text-slate-900 font-semibold">{competition?.["End Regist"]}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-6 border-t border-gray-200">
              <Button
                as="a"
                href={competition?.["Link Guidebook"] || "#"}
                target="_blank"
                rel="noopener noreferrer"
                disabled={!competition?.["Link Guidebook"]}
                className="w-full bg-blue-600 hover:bg-blue-700 font-semibold"
              >
                📘 Guidebook
              </Button>
              <Button
                as="a"
                href={competition?.["Link Pendaftaran"] || "#"}
                target="_blank"
                rel="noopener noreferrer"
                disabled={!competition?.["Link Pendaftaran"]}
                className="w-full bg-green-600 hover:bg-green-700 font-semibold"
              >
                ✏️ Register Now
              </Button>
            </div>
          </div>
        </div>

        {/* Description Section */}
        {competition?.Description && (
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {competition.Description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitionDetails;
