const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());

// Serve static files from the 'public' directory (Optional)
app.use(express.static('public'));

// API Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Get port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received. Closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
