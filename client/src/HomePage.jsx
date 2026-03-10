"use client";

import { useState, useEffect } from "react";
import { Card, Badge, Button, Navbar, Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiArrowRight, HiSparkles, HiTrophy, HiUsers } from "react-icons/hi2";

const HomePage = () => {
  const [competitions, setCompetitions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  // What We Do Cards Data
  const whatWeDoCards = [
    {
      icon: HiSparkles,
      title: "Skill Development",
      description: "Workshops and bootcamps focused on the latest tech stacks and industry best practices to enhance your professional growth.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: HiTrophy,
      title: "Competitions",
      description: "Host and curate competitive programming, UI/UX, and business case competitions that challenge and inspire.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: HiUsers,
      title: "Community",
      description: "Build strong networks with alumni and peers for mentorship, collaboration, and career growth opportunities.",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const tagColors = {
    "coding": "info",
    "ui/ux": "warning",
    "business": "success",
    "mobile": "purple",
    "web": "pink",
    "data": "failure"
  };

  const getTagColor = (tag) => {
    const lowerTag = tag.toLowerCase();
    return tagColors[lowerTag] || "info";
  };

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/competitions/all`);
        const result = await response.json();
        
        if (response.ok && result.data) {
          const transformedCompetitions = result.data.map((item) => ({
            id: item.Id,
            name: item.Nama,
            tags: item.Tags.split(",").map(tag => tag.trim()),
            status: item.Status,
            startDate: item["Start Regist"],
            endDate: item["End Regist"],
            image: item["Image LInk"],
            month: item.month
          }));
          setCompetitions(transformedCompetitions);
        } else {
          console.error("Failed to fetch competitions:", result);
        }
      } catch (error) {
        console.error("Error fetching competitions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, [API_URL]);

  const filteredCompetitions = competitions.filter((competition) =>
    competition.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <Navbar fluid className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">
        <Navbar.Brand href="/">
          <span className="self-center whitespace-nowrap text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            🏆 HMSI Portal
          </span>
        </Navbar.Brand>
        <div className="flex items-center gap-4">
          <a href="#competitions" className="hidden md:inline text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Competitions
          </a>
          <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
            Login
          </Link>
        </div>
      </Navbar>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 md:py-32">
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div>
              <div className="inline-block mb-6">
                <Badge color="info" className="bg-blue-500/20 text-blue-200 px-4 py-2 rounded-full">
                  ✨ Welcome to HMSI
                </Badge>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Empower Your{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Tech Career
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Join Indonesia's premier information systems community. Participate in world-class competitions, develop cutting-edge skills, and build lasting professional networks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#competitions" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105">
                  Explore Competitions
                  <HiArrowRight className="w-5 h-5" />
                </a>
                <a href="#what-we-do" className="inline-flex items-center justify-center gap-2 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 font-bold py-3 px-8 rounded-lg transition-all">
                  Learn More
                </a>
              </div>
            </div>

            {/* Right Column - Stats */}
            <div className="hidden md:grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="text-4xl font-bold text-cyan-400 mb-2">50+</div>
                <p className="text-gray-300">Active Competitions</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="text-4xl font-bold text-blue-400 mb-2">5K+</div>
                <p className="text-gray-300">Community Members</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="text-4xl font-bold text-green-400 mb-2">100+</div>
                <p className="text-gray-300">Workshops Held</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="text-4xl font-bold text-purple-400 mb-2">15+</div>
                <p className="text-gray-300">Years Experience</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-auto">
            <path
              d="M0,50 Q300,100 600,50 T1200,50 L1200,120 L0,120 Z"
              fill="white"
              opacity="0.05"
            ></path>
          </svg>
        </div>
      </section>

      {/* What We Do Section */}
      <section id="what-we-do" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              What We Do
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              HMSI empowers students through three pillars of excellence: skill development, competitive events, and community building.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {whatWeDoCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  {/* Gradient Top Bar */}
                  <div className={`h-1 bg-gradient-to-r ${card.color}`}></div>

                  {/* Content */}
                  <div className="p-8">
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${card.color} mb-6`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {card.description}
                    </p>
                    <a href="#" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold group/link">
                      Learn more
                      <HiArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Competitions Section */}
      <section id="competitions" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                  Active Competitions
                </h2>
                <p className="text-lg text-gray-600">
                  Find and register for our latest competitive events
                </p>
              </div>

              {/* Search Bar */}
              <div className="w-full md:w-96">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search competitions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors"
                  />
                  <svg
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mt-3 text-right">
                  Found <span className="font-bold text-slate-900">{filteredCompetitions.length}</span> result{filteredCompetitions.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Competitions Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600"></div>
            </div>
          ) : filteredCompetitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCompetitions.map((competition) => (
                <div key={competition.id} className="group">
                  <Card className="h-full border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    {/* Image Container */}
                    <div className="relative w-full h-56 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                      <iframe
                        src={competition.image}
                        className="w-full h-full border-0 group-hover:scale-110 transition-transform duration-500"
                        title={competition.name}
                        scrolling="no"
                      />
                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        {competition.status === "Open" ? (
                          <Badge color="success" className="font-bold px-3 py-1">
                            OPEN
                          </Badge>
                        ) : (
                          <Badge color="failure" className="font-bold px-3 py-1">
                            CLOSED
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col h-full">
                      <h5 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {competition.name}
                      </h5>

                      {/* Tags */}
                      {competition.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {competition.tags.slice(0, 3).map((tag, idx) => (
                            <Badge key={idx} color={getTagColor(tag)} className="text-xs font-medium">
                              {tag}
                            </Badge>
                          ))}
                          {competition.tags.length > 3 && (
                            <Badge color="gray" className="text-xs font-medium">
                              +{competition.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Spacer */}

                      {/* Date & Button */}
                      <div className="flex flex-col flex-grow justify-end">
                        {competition.status === "Open" && competition.endDate && (
                          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
                            <p className="text-sm text-blue-700 font-medium">
                              📅 Closes: {formatDate(competition.endDate)}
                            </p>
                          </div>
                        )}

                        {competition.status === "Closed" && (
                          <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
                            <p className="text-sm text-red-700 font-medium">
                              Registration Closed
                            </p>
                          </div>
                        )}

                        <Link to={`/competition-details/${competition.month}/${competition.id}`} className="block w-full">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-2 transition-colors">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">No competitions found</h3>
              <p className="text-gray-600 text-lg">
                We couldn't find any competitions matching "{searchTerm}". Try adjusting your search.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer container className="bg-slate-900 text-white border-t border-slate-800">
        <Footer.Divider className="bg-slate-700" />
        <div className="w-full px-4 py-6">
          <div className="grid w-full md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">🏆 HMSI Portal</h3>
              <p className="text-gray-400">
                Empowering the future of information systems through competitions and community.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#competitions" className="hover:text-blue-400 transition-colors">Competitions</a></li>
                <li><a href="#what-we-do" className="hover:text-blue-400 transition-colors">What We Do</a></li>
                <li><Link to="/login" className="hover:text-blue-400 transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Contact</h4>
              <p className="text-gray-400">
                Email: info@hmsi.id<br />
                Phone: +62 811 234 5678
              </p>
            </div>
          </div>
          <Footer.Divider className="bg-slate-700" />
          <div className="flex justify-between items-center pt-6">
            <Footer.Copyright by="HMSI ITS" year={2024} className="text-gray-400" />
            <div className="flex gap-4 text-gray-400">
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </Footer>
    </div>
  );
};

export default HomePage;