const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const path = require("path");
const app = express();

// CORS options
const corsOptions = {
  origin: ["http://localhost:5173"], // Replace with your frontend's origin
};

app.use(cors(corsOptions));

// Load the service account credentials
const credentialsPath = path.join(__dirname, "credentials.json");
const auth = new google.auth.GoogleAuth({
  keyFile: credentialsPath,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

// ID of your Google Sheet
const SHEET_ID = "your_google_sheet_id"; // Replace with your Google Sheet ID
const SHEET_RANGE = "Sheet1!A2:I"; // Adjust the range based on your sheet's structure

// API route to fetch competition data
app.get("/api/competitions", async (req, res) => {
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: SHEET_RANGE,
    });

    // Parse Google Sheet data
    const rows = response.data.values;
    if (!rows.length) {
      return res.status(404).json({ error: "No data found" });
    }

    // Map rows to competition objects
    const competitions = rows.map((row) => ({
      name: row[0] || "N/A",
      startDate: row[1] || "N/A",
      endDate: row[2] || "N/A",
      description: row[3] || "N/A",
      categories: row[4] || "N/A",
      status: row[5] || "N/A",
      posterImage: row[6] || "N/A",
      guidebookLink: row[7] || "N/A",
      registrationLink: row[8] || "N/A",
    }));

    res.json(competitions);
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
