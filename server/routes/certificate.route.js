import express from "express";
import { issueCertificate } from "../controllers/certificate.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Use GET request for downloading certificate
router.get("/:courseId", isAuthenticated, issueCertificate);

export default router;
