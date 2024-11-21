import express from "express";
import router from "./Router/router.js";
const app = express();
const PORT = process.env.PORT || 4001;
// Middleware
app.use(express.json());  // To parse JSON bodies
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
// Routes
app.use('/', router);  // Use the single API router for all /api routes

// Catch-all for non-existing routes

export default app;
