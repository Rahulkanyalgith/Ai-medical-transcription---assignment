import express from "express";
import multer from "multer";

import { transcribeAudio } from "../services/whisperServices.js";
import { correctMedicalTerms } from "../services/correctionService.js";
import { cleanText } from "../services/cleaningService.js";
import { extractConditions } from "../services/extractService.js";

const router = express.Router();

const upload = multer({ dest: "src/uploads/" });

router.post("/", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No audio file uploaded",
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        error: "Transcription service is not configured",
        details: "Set OPENAI_API_KEY in your environment and restart the server.",
      });
    }

    // 1. Raw transcription
    const rawTranscript = await transcribeAudio(req.file.path);

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

    console.error(error);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

export default router;