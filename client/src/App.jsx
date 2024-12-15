"use client";

import React, { useState, useEffect } from "react";
import { Navbar, Footer } from "flowbite-react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage";
import CompetitionDetails from "./CompetitionDetails";
import LoginPage from "./LoginPage";
import DashboardPage from "./DashboardPage";
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar fluid rounded>
          <Navbar.Brand href="/">
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              Portal Lomba HMSI
            </span>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Link to="/login" className="ml-4">
              Login
            </Link>
          </Navbar.Collapse>
        </Navbar>

        {/* Main Content */}
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/competition-details/:sheetName/:id" element={<CompetitionDetails />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard/*" element={<DashboardPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer container>
          <Footer.Copyright href="#" by="RTA HMSI INOVASI" year={2024} />
          <Footer.LinkGroup>
            <Footer.Link href="#">About</Footer.Link>
            <Footer.Link href="#">Privacy Policy</Footer.Link>
            <Footer.Link href="#">Licensing</Footer.Link>
            <Footer.Link href="#">Contact</Footer.Link>
          </Footer.LinkGroup>
        </Footer>
      </div>
    </Router>
  );
};

export default App;
