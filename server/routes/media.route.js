import express from "express";
import upload from "../utils/multer.js";
import { uploadMedia, uploadPDF } from "../utils/cloudinary.js";

const router = express.Router();

router.route("/upload-video").post(upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMedia(req.file.path);
    res.status(200).json({
      success: true,
      message: "File uploaded successfully.",
      data: result
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error uploading file" })
  }
});

router.route("/upload-pdf").post(upload.single("file"), async (req, res) => {
  try {
    const result = await uploadPDF(req.file.path); // use the PDF-specific uploader
    res.status(200).json({
      success: true,
      message: "PDF uploaded successfully.",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error uploading PDF" });
  }
});

export default router;