"use client";

import React, { useState, useEffect } from "react";
import { Button, TextInput, Modal } from "flowbite-react";

const CompetitionsManagement = () => {
  const [competitions, setCompetitions] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, data: null });
  const [newCompetition, setNewCompetition] = useState({ name: "", year: "" });

  const fetchCompetitions = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/competitions");
      const result = await response.json();

      if (response.ok) {
        setCompetitions(result.data);
      } else {
        console.error(result.error || "Failed to fetch competitions.");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/competitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCompetition),
      });

      if (response.ok) {
        fetchCompetitions();
        setModal({ isOpen: false, data: null });
      } else {
        console.error("Failed to add competition.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/competitions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCompetitions();
      } else {
        console.error("Failed to delete competition.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/competitions/${modal.data.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(modal.data),
        }
      );

      if (response.ok) {
        fetchCompetitions();
        setModal({ isOpen: false, data: null });
      } else {
        console.error("Failed to edit competition.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Competitions Management</h2>
      <Button onClick={() => setModal({ isOpen: true, data: null })}>Add Competition</Button>
      <div className="mt-4 space-y-4">
        {competitions.map((competition) => (
          <div key={competition.id} className="p-4 bg-white shadow rounded flex justify-between">
            <div>
              <h3 className="text-lg font-bold">{competition.name}</h3>
              <p>Year: {competition.year}</p>
            </div>
            <div className="space-x-2">
              <Button size="sm" onClick={() => setModal({ isOpen: true, data: competition })}>
                Edit
              </Button>
              <Button size="sm" color="failure" onClick={() => handleDelete(competition.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal show={modal.isOpen} onClose={() => setModal({ isOpen: false, data: null })}>
        <Modal.Header>{modal.data ? "Edit Competition" : "Add Competition"}</Modal.Header>
        <Modal.Body>
          <TextInput
            placeholder="Name"
            value={modal.data ? modal.data.name : newCompetition.name}
            onChange={(e) =>
              modal.data
                ? setModal({ ...modal, data: { ...modal.data, name: e.target.value } })
                : setNewCompetition({ ...newCompetition, name: e.target.value })
            }
          />
          <TextInput
            placeholder="Year"
            type="number"
            value={modal.data ? modal.data.year : newCompetition.year}
            onChange={(e) =>
              modal.data
                ? setModal({ ...modal, data: { ...modal.data, year: e.target.value } })
                : setNewCompetition({ ...newCompetition, year: e.target.value })
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={modal.data ? handleEdit : handleAdd}>
            {modal.data ? "Save Changes" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CompetitionsManagement;
