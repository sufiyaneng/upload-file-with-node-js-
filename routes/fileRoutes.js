import express from "express";
import uploadFile  from "../controllers/upload.controller.js";

const router = express.Router();

// Directly call the controller for the `/upload` endpoint
router.post('/upload', uploadFile);

export default router;