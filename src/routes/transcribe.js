import express from "express";
import multer from "multer";

import { transcribeAudio } from "../services/whisperServices.js";
import { correctMedicalTerms } from "../services/correctionService.js";
import { cleanText } from "../services/cleaningService.js";
import { extractConditions } from "../services/extractService.js";
import fs from "fs";
import path from "path";

const router = express.Router();

const upload = multer({ dest: "src/uploads/" });

router.post("/", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No audio file uploaded",
      });
    }

    console.log("Received upload:", { originalname: req.file.originalname, path: req.file.path, size: req.file.size });

    // Basic validation: ensure uploaded file looks like audio
    const allowedMimePrefixes = ["audio/", "video/"]; // allow some video containers too
    const mimetype = req.file.mimetype || "";
    const looksLikeAudio = allowedMimePrefixes.some((p) => mimetype.startsWith(p));
    if (!looksLikeAudio) {
      console.warn("Uploaded file does not look like audio. MIME:", mimetype);
      return res.status(400).json({ error: "Uploaded file is not an audio file", mimetype });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        error: "Transcription service is not configured",
        details: "Set OPENAI_API_KEY in your environment and restart the server.",
      });
    }

    // 1. Raw transcription
    console.log("Starting transcription for:", req.file.path);
    // Ensure the uploaded file has the original extension so OpenAI can detect format
    const originalExt = path.extname(req.file.originalname) || "";
    let filePathWithExt = req.file.path;
    if (originalExt && !req.file.path.endsWith(originalExt)) {
      filePathWithExt = req.file.path + originalExt;
      try {
        // copy then unlink to avoid cross-device rename issues
        await fs.promises.copyFile(req.file.path, filePathWithExt);
        const stats = await fs.promises.stat(filePathWithExt);
        console.log("Copied upload to include extension:", filePathWithExt, "size:", stats.size);
        try {
          await fs.promises.unlink(req.file.path);
        } catch (uerr) {
          console.warn("Could not remove original upload file:", uerr);
        }
      } catch (copyErr) {
        console.error("Failed to copy uploaded file to include extension:", copyErr);
        // continue with original path — transcribeAudio will handle errors
      }
    }

    let rawTranscript;
    try {
      rawTranscript = await transcribeAudio(filePathWithExt);
      console.log("Transcription completed, length:", rawTranscript?.length || 0);
    } catch (innerErr) {
      console.error("Error during transcribeAudio:", innerErr);
      throw innerErr;
    }

    // 2. Medical correction
    const correctedText = correctMedicalTerms(rawTranscript);

    // 3. Cleaning
    const cleanedText = cleanText(correctedText);

    // 4. Extract conditions
    const conditions = extractConditions(cleanedText);

    res.json({
      transcript: cleanedText,
      conditions,
      confidence: "high",
    });

  } catch (error) {
    if (error?.message === "OPENAI_API_KEY is not set") {
      return res.status(503).json({
        error: "Transcription service is not configured",
        details: "Set OPENAI_API_KEY in your environment and restart the server.",
      });
    }

    console.error("Transcription error:", error);
    res.status(500).json({
      error: "Something went wrong",
      details: error.message || error.toString()
    });
  }
});

export default router;