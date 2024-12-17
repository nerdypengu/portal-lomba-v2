"use client";

import React, { useState, useEffect } from "react";
import { Button, TextInput, Modal } from "flowbite-react";

const CompetitionsManagement = () => {
  const [competitions, setCompetitions] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, data: null });
  const [newCompetition, setNewCompetition] = useState({
    name: "",
    startRegistDate: "",
    endRegistDate: "",
    tags: "",
    desc: "",
    image: null, // For file upload
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Mapping function: Response keys -> Modal keys
  const mapResponseToModalData = (responseData) => ({
    id: responseData.Id,
    name: responseData.Nama,
    startRegistDate: responseData["Start Regist"],
    endRegistDate: responseData["End Regist"],
    tags: responseData.Tags || "",
    desc: responseData.Description || "",
    imageLink: responseData["Image LInk"] || "",
    guidebookLink: responseData["Link Guidebook"] || "",
    registrationLink: responseData["Link Pendaftaran"] || "",
    month: responseData.month,
  });

  // Mapping function: Modal keys -> API request payload
  const mapModalDataToRequestPayload = (modalData) => ({
    name: modalData.name,
    startRegistDate: modalData.startRegistDate,
    endRegistDate: modalData.endRegistDate,
    tags: modalData.tags,
    desc: modalData.desc,
    uploadImage: modalData.image || null, // Adjust if you handle file uploads
  });

  const fetchCompetitions = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/competitions/all");
      const result = await response.json();

      if (response.ok) {
        const mappedData = result.data.map(mapResponseToModalData);
        setCompetitions(mappedData);
      } else {
        console.error(result.error || "Failed to fetch competitions.");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleAdd = async () => {
    try {
      const formData = new FormData();
      Object.keys(newCompetition).forEach((key) => {
        if (newCompetition[key]) {
          formData.append(key, newCompetition[key]);
        }
      });
  
      // Log form data to ensure it's correct
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
  
      // Add credentials: "include" to send cookies with the request
      const response = await fetch("http://localhost:8080/api/competitions", {
        method: "POST",
        body: formData,
        credentials: "include", // This ensures the JWT cookie is included with the request
      });
  
      if (response.ok) {
        fetchCompetitions(); // Refresh competitions list
        setModal({ isOpen: false, data: null });
        setNewCompetition({
          name: "",
          startRegistDate: "",
          endRegistDate: "",
          tags: "",
          desc: "",
          image: null,
        }); // Reset form
      } else {
        console.error("Failed to add competition.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async () => {
    try {
      // Map modal data to the request payload
      const payload = mapModalDataToRequestPayload(modal.data);

      const response = await fetch(
        `http://localhost:8080/api/competitions/${modal.data.month}/${modal.data.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
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

  const handleDelete = async (id,month) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/competitions/${month}/${id}`,
        {
          method: "DELETE",
        }
      );
  
      if (response.ok) {
        fetchCompetitions();
        setModal({ isOpen: false, data: null });
      } else {
        console.error("Failed to delete competition.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCompetitions = competitions.filter((competition) =>
    competition.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchCompetitions();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Competitions Management</h2>
  
      {/* Search Bar */}
      <div className="mb-4">
        <TextInput
          placeholder="Search competitions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
  
      {/* Add Competition Button */}
      <div className="mb-4">
        <Button onClick={() => setModal({ isOpen: true, data: null })}>
          Add Competition
        </Button>
      </div>
  
      <div className="mt-4 space-y-4">
        {filteredCompetitions.map((competition) => (
          <div
            key={competition.id}
            className="p-4 bg-white shadow rounded flex items-center justify-between"
          >
            <div className="flex-1">
              <h3 className="text-lg font-bold">{competition.name}</h3>
            </div>
  
            <div className="flex-1 text-center">
              <p className="text-sm text-gray-600">
                {competition.startRegistDate} - {competition.endRegistDate}
              </p>
            </div>
  
            <div className="flex-shrink-0 flex space-x-2">
              <Button
                size="sm"
                onClick={() => setModal({ isOpen: true, data: competition })}
              >
                Edit
              </Button>
              <Button
                size="sm"
                color="failure"
                onClick={() => handleDelete(competition.id,competition.month)}
              >
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
            placeholder="Start Regist"
            type="date"
            value={modal.data ? modal.data.startRegistDate : newCompetition.startRegistDate}
            onChange={(e) =>
              modal.data
                ? setModal({
                    ...modal,
                    data: { ...modal.data, startRegistDate: e.target.value },
                  })
                : setNewCompetition({ ...newCompetition, startRegistDate: e.target.value })
            }
          />
          <TextInput
            placeholder="End Regist"
            type="date"
            value={modal.data ? modal.data.endRegistDate : newCompetition.endRegistDate}
            onChange={(e) =>
              modal.data
                ? setModal({
                    ...modal,
                    data: { ...modal.data, endRegistDate: e.target.value },
                  })
                : setNewCompetition({ ...newCompetition, endRegistDate: e.target.value })
            }
          />
          <TextInput
            placeholder="Tags"
            value={modal.data ? modal.data.tags : newCompetition.tags}
            onChange={(e) =>
              modal.data
                ? setModal({ ...modal, data: { ...modal.data, tags: e.target.value } })
                : setNewCompetition({ ...newCompetition, tags: e.target.value })
            }
          />
          <TextInput
            placeholder="Description"
            value={modal.data ? modal.data.desc : newCompetition.desc}
            onChange={(e) =>
              modal.data
                ? setModal({ ...modal, data: { ...modal.data, desc: e.target.value } })
                : setNewCompetition({ ...newCompetition, desc: e.target.value })
            }
          />
          {!modal.data && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Upload Image</label>
              <input
                type="file"
                className="mt-2"
                onChange={(e) =>
                  setNewCompetition({ ...newCompetition, image: e.target.files[0] })
                }
              />
            </div>
          )}
          {modal.data && modal.data.imageLink && (
            <div className="mb-4">
              <iframe
                src={modal.data.imageLink}
                title="Current Poster"
                className="w-full h-64 mb-2 border rounded"
              />
              <label className="block text-sm font-medium text-gray-700">Upload New Image</label>
              <input
                type="file"
                className="mt-2"
                onChange={(e) =>
                  setModal({
                    ...modal,
                    data: { ...modal.data, image: e.target.files[0] },
                  })
                }
              />
            </div>
          )}
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
