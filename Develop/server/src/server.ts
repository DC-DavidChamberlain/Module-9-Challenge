import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import express from "express";
import path from "path";
dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Import the routes
import routes from "./routes/index.js";

const app = express();

const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files of entire client dist folder
app.use(express.static(path.join(__dirname, "client/dist")));

// Middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
