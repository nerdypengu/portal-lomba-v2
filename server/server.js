const express = require("express");
const multer = require("multer");
const { google } = require("googleapis");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const crypto = require("crypto");
const {Readable} = require("stream");
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser()); // For cookie parsing
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST","DELETE","PUT"],
  credentials: true,
}));

// Import the authorization middleware from cookieAuth.js
const { authorization } = require("./cookieAuth"); // Import the authorization middleware

// Set up file upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
});

// Set up Google Sheets API authentication
const credentialsPath = path.join(__dirname, "credentials.json");
const auth = new google.auth.GoogleAuth({
  keyFile: credentialsPath,
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
  ],
});

const sheets = google.sheets({ version: "v4", auth });
const drive = google.drive({version : "v3", auth});

// Define constants
const SPREADSHEET_ID = "1gpJ7LHMC9vOH8ArfEsO8ixS-y77PKY-M921jGIYjopg"; // Replace with your Google Sheet ID
const AUTH_SHEET_NAME = "AUTH"; // Sheet containing emails and hashed passwords
const SECRET_KEY = process.env.JWT_KEY || "PSOFP11"; // JWT secret from environment variable

// Helper function to fetch a user by email from Google Sheets
async function fetchUser(email) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${AUTH_SHEET_NAME}!A:B`, // Column A: Emails, Column B: SHA-256 Hashed Passwords
    });

    const rows = response.data.values || [];
    for (const row of rows) {
      if (row[0] === email) {
        return { email: row[0], hashedPassword: row[1] };
      }
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw new Error("Failed to fetch user data from the sheet");
  }
}

// Function to hash the input password with SHA-256
function hashPasswordWithSHA256(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// API to login and generate a token (stored in a cookie)
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await fetchUser(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const hashedInputPassword = hashPasswordWithSHA256(password);

    if (hashedInputPassword !== user.hashedPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Make sure it's true in production
      sameSite: "Strict", // Ensure the cookie is sent with requests
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: 'None' });
  res.status(200).json({ message: "Logout successful" });
});


async function getOrCreateSubFolder(parentFolderId, folderName) {
  const response = await drive.files.list({
    q: `'${parentFolderId}' in parents and name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder'`,
    fields: "files(id, name)",
  });

  if (response.data.files.length === 0) {
    const folderMetadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentFolderId],
    };
    const folder = await drive.files.create({
      resource: folderMetadata,
      fields: "id, name",
    });
    return folder.data.id;
  } else {
    return response.data.files[0].id;
  }
}

async function uploadImageToFolder(imageBuffer, imageName, folderId) {
  const mimeType = imageName.endsWith(".png") ? "image/png" : "image/jpeg";

  const fileMetadata = {
    name: imageName,
    parents: [folderId],
  };

  const media = {
    mimeType: mimeType,
    body: Readable.from(imageBuffer),
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: "id, webViewLink",
  });

  const fileId = response.data.id;
  const directLink = `https://drive.google.com/uc?id=${fileId}`;

  return directLink;
}

async function getSheetParentFolder(sheetId) {
  try {
    const drive = google.drive({ version: "v3", auth });

    const file = await drive.files.get({
      fileId: sheetId,
      fields: "parents",
    });

    const parentFolderId = file.data.parents ? file.data.parents[0] : null;
    return parentFolderId;
  } catch (error) {
    console.error("Error getting sheet parent folder:", error);
    throw new Error("Failed to get sheet parent folder.");
  }
}

async function insertCompetitionData(
  sheetId,
  sheetName,
  name,
  startRegistDate,
  endRegistDate,
  tags,
  desc,
  imageBuffer,
  imageName
) {
  const parentFolderId = await getSheetParentFolder(sheetId);
  const folderId = await getOrCreateSubFolder(parentFolderId, sheetName);
  const directLink = await uploadImageToFolder(imageBuffer, imageName, folderId);
  const imageFormula = `=IMAGE("${directLink}")`;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${sheetName}!A:A`,
  });

  const nextId =
    response.data.values && response.data.values.length > 1
      ? parseInt(response.data.values[response.data.values.length - 1][0]) + 1
      : 1;

  const tagsString = Array.isArray(tags) ? tags.join(", ") : tags;
  const statusFormula = `=IF(AND(TODAY()>=DATEVALUE("${startRegistDate}"),TODAY()<=DATEVALUE("${endRegistDate}")),"Open","Closed")`;

  const nextRow = response.data.values ? response.data.values.length + 1 : 1;

  const data = [
    [
      nextId,
      name,
      startRegistDate,
      endRegistDate,
      tagsString,
      desc,
      imageFormula,
      statusFormula,
      directLink
    ],
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${sheetName}!A${nextRow}:H${nextRow}`,
    valueInputOption: "USER_ENTERED",
    resource: {
      values: data,
    },
  });

  console.log("Data inserted successfully into sheet:", sheetId);
}


//CREATE COMPETITION
app.post("/api/competitions", authorization, upload.single("image"), async (req, res) => {
  const {
    name,
    startRegistDate,
    endRegistDate,
    tags,
    desc,
  } = req.body;

  const sheetId = "1gpJ7LHMC9vOH8ArfEsO8ixS-y77PKY-M921jGIYjopg";
  const sheetName = "Januari";

  if (
    !sheetId ||
    !sheetName ||
    !name ||
    !startRegistDate ||
    !endRegistDate ||
    !tags ||
    !desc
  ) {
    return res
      .status(400)
      .send(
        "Missing required fields (sheetId, sheetName, name, startRegistDate, endRegistDate, tags, desc)."
      );
  }

  if (!req.file) {
    return res.status(400).send("No image file uploaded.");
  }

  try {
    const imageBuffer = req.file.buffer;
    const imageName = req.file.originalname;
    await insertCompetitionData(
      sheetId,
      sheetName,
      name,
      startRegistDate,
      endRegistDate,
      tags,
      desc,
      imageBuffer,
      imageName
    );
    res.status(200).send("Competition data inserted successfully.");
  } catch (err) {
    console.error("Error inserting competition data:", err);
    res.status(500).send("Failed to insert data.");
  }
});

async function getAllSheetNames(sheetId) {
  const response = await sheets.spreadsheets.get({
    spreadsheetId: sheetId,
    fields: "sheets(properties(title))",
  });
  return response.data.sheets.map(sheet => sheet.properties.title);
}



// Fetch all competitions from all sheets
app.get("/api/competitions/all", async (req, res) => {
  const sheetId = "1gpJ7LHMC9vOH8ArfEsO8ixS-y77PKY-M921jGIYjopg";

  if (!sheetId) {
    return res.status(400).send("Missing required parameter: sheetId.");
  }

  try {
    const sheetNames = await getAllSheetNames(sheetId);
    let allCompetitions = [];

    for (const sheetName of sheetNames) {
      if (sheetName === "AUTH") continue;

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${sheetName}!A:K`,
      });

      const rows = response.data.values || [];
      const headers = rows[0];
      const data = rows.slice(1).map((row) => {
        const competition = {};
        headers.forEach((header, index) => {
          let value = row[index] || null;

          if (header === "Image LInk" && value && value.includes("drive.google.com/uc?id=")) {
            const match = value.match(/id=([a-zA-Z0-9_-]+)/);
            if (match) {
              const fileId = match[1];
              value = `https://drive.google.com/file/d/${fileId}/preview`;
            }
          }

          competition[header] = value;
        });
        competition["month"] = sheetName;

        return competition;
      });

      allCompetitions.push(...data);
    }

    res.status(200).json({ data: allCompetitions });
  } catch (err) {
    console.error("Error fetching competitions:", err);
    res.status(500).send("Failed to fetch competitions.");
  }
});



app.get("/api/competitions/:sheetName/:id", async (req, res) => {
  const { sheetName, id } = req.params;
  const sheetId = "1gpJ7LHMC9vOH8ArfEsO8ixS-y77PKY-M921jGIYjopg";

  if (!id || !sheetName) {
    return res.status(400).json({ error: "Missing required parameters: id and sheetName." });
  }

  if (sheetName === "AUTH") {
    return res.status(400).json({ error: "You don't have access to this file." });
  }

  try {
    // Check if the sheetName exists in the spreadsheet
    const sheetNames = await getAllSheetNames(sheetId);
    if (!sheetNames.includes(sheetName)) {
      return res.status(404).json({ error: `Sheet with name ${sheetName} not found.` });
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!A:K`, // Query the specific sheet
    });

    const rows = response.data.values || [];
    const headers = rows[0];
    const data = rows.slice(1);

    // Search for the competition in the specified sheet
    const competition = data.find((row) => row[0] === id);

    if (!competition) {
      return res.status(404).json({ error: "Competition not found." });
    }

    const competitionData = {};
    headers.forEach((header, index) => {
      competitionData[header] = competition[index] || null;
    });

    // Transform the Image Link to an embed URL if it matches the Google Drive format
    if (competitionData["Image LInk"]) {
      const imageUrl = competitionData["Image LInk"];
      const match = imageUrl.match(/id=([^&]+)/); // Extract fileId from the URL
      if (match && match[1]) {
        const fileId = match[1];
        competitionData["Image LInk"] = `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }

    res.status(200).json({ data: competitionData });
  } catch (err) {
    console.error("Error fetching competition by ID and SheetName:", err);
    res.status(500).json({ error: "Failed to fetch competition." });
  }
});





//Update Competition Data
app.put("/api/competitions/:sheetName/:id", upload.single("image"), async (req, res) => {
  const { sheetName, id } = req.params;
  const { name, startRegistDate, endRegistDate, tags, desc } = req.body;
  const sheetId = "1gpJ7LHMC9vOH8ArfEsO8ixS-y77PKY-M921jGIYjopg"; 

  if (!sheetId || !sheetName || !id) {
    return res.status(400).send("Missing required fields (sheetId, sheetName, id).");
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!A:K`,
    });

    const rows = response.data.values || [];
    const headers = rows[0];
    const data = rows.slice(1);

    const rowIndex = data.findIndex(row => row[0] === id);

    if (rowIndex === -1) {
      return res.status(404).send("Competition not found.");
    }

    // Handle the image file if uploaded
    let imageLink = data[rowIndex][8];
    let imageFormula = data[rowIndex][8];
    
    if (req.file) {
      // Extract the file ID from the old image link (if it exists)
      if (imageLink) {
        const oldImageId = imageLink.match(/id=([a-zA-Z0-9_-]+)/);
        if (oldImageId) {
          await deleteOldImage(oldImageId[1]); // Delete the old image
        }
      }

      const parentFolderId = await getSheetParentFolder(sheetId);
      const folderId = await getOrCreateSubFolder(parentFolderId, sheetName);
      const imageBuffer = req.file.buffer;
      const imageName = req.file.originalname;
      imageLink = await uploadImageToFolder(imageBuffer, imageName, folderId);
      imageFormula = `=IMAGE("${imageLink}")`;
    }

    // Prepare the updated row
    const updatedRow = [
      id,
      name || data[rowIndex][1],
      startRegistDate || data[rowIndex][2],
      endRegistDate || data[rowIndex][3],
      tags || data[rowIndex][4],
      desc || data[rowIndex][5],
      imageFormula,
      "",
      imageLink
    ];

    // Determine the status based on the current date and registration dates
    const today = new Date();
    const updatedStartRegistDate = new Date(startRegistDate || data[rowIndex][2]);
    const updatedEndRegistDate = new Date(endRegistDate || data[rowIndex][3]);

    const status =
      today >= updatedStartRegistDate && today <= updatedEndRegistDate
        ? "OPEN"
        : "CLOSED";

    // Add the status to the updated row
    updatedRow[7] = status; // Assuming column H is the status column

    const targetRange = `${sheetName}!A${rowIndex + 2}:I${rowIndex + 2}`;
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: targetRange,
      valueInputOption: "USER_ENTERED", // Treat as user-entered values to handle formulas
      resource: {
        values: [updatedRow],
      },
    });

    res.status(200).send("Competition updated successfully.");
  } catch (err) {
    console.error("Error updating competition:", err);
    res.status(500).send("Failed to update competition.");
  }
});

// Helper function to delete the old image from Google Drive
async function deleteOldImage(imageId) {
  try {
    const drive = google.drive({ version: 'v3', auth: auth });
    await drive.files.delete({
      fileId: imageId,
    });
    console.log(`Old image with ID ${imageId} deleted successfully.`);
  } catch (err) {
    console.error("Failed to delete old image:", err);
  }
}


// DELETE COMPETITION
app.delete("/api/competitions/:sheetName/:id", async (req, res) => {
  const { sheetName, id } = req.params;
  const sheetId = "1gpJ7LHMC9vOH8ArfEsO8ixS-y77PKY-M921jGIYjopg"; 

  if (!sheetId || !sheetName || !id) {
    return res.status(400).send("Missing required fields (sheetId, sheetName, id).");
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!A:I`, // Adjust the range to include the new image link column
    });

    const rows = response.data.values || [];
    const headers = rows[0];
    const data = rows.slice(1);

    const rowIndex = data.findIndex(row => row[0] === id);

    if (rowIndex === -1) {
      return res.status(404).send("Competition not found.");
    }

    // Extract the image link from the relevant column (column I)
    const imageLink = data[rowIndex][8]; // Assuming column I is the image link column

    // If the image link exists, delete the corresponding file from Google Drive
    if (imageLink) {
      const imageIdMatch = imageLink.match(/id=([a-zA-Z0-9_-]+)/);
      if (imageIdMatch) {
        const imageId = imageIdMatch[1];
        await deleteOldImage(imageId); // Delete the old image from Google Drive
      }
    }

    // Shift the data up (copying each row after the deleted one into the previous row)
    for (let i = rowIndex + 1; i < data.length; i++) {
      const updatedRow = data[i];
      // Rebuild the image formula for each row in the image column (column I)
      const imageLink = updatedRow[8]; // Get the image link from the updated row
      updatedRow[6] = `=IMAGE("${imageLink}")`; // Rebuild the image formula

      const updatedRange = `${sheetName}!A${i + 1}:I${i + 1}`;
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: updatedRange,
        valueInputOption: "USER_ENTERED", // Use USER_ENTERED to interpret formulas
        resource: {
          values: [updatedRow],
        },
      });
    }

    // Blank out the last row
    const lastRowRange = `${sheetName}!A${data.length + 1}:I${data.length + 1}`;
    const blankRow = headers.map(() => ""); // Replace with empty cells
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: lastRowRange,
      valueInputOption: "RAW",
      resource: {
        values: [blankRow],
      },
    });

    res.status(200).send("Competition deleted successfully.");
  } catch (err) {
    console.error("Error deleting competition:", err);
    res.status(500).send("Failed to delete competition.");
  }
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
