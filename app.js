// Main application file (app.js)
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const requestLogger = require("./middleware/logger");
app.use(requestLogger);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const greetingsRouter = require("./routes/greetings");

// API routes
app.use("/api/greetings", greetingsRouter);

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Create initial data.json if it doesn't exist
if (!fs.existsSync(path.join(dataDir, "data.json"))) {
  fs.writeFileSync(
    path.join(dataDir, "data.json"),
    JSON.stringify([], null, 2),
    "utf8"
  );
}

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Hello World API!",
    version: "1.0.0",
    endpoints: {
      greetings: "/api/greetings",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}`);
});
