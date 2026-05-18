import fs from "fs";
import OpenAI from "openai";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  return new OpenAI({
    apiKey,
  });
}

export async function transcribeAudio(filePath) {
  const client = getClient();

  const transcription = await client.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: "whisper-1",
  });

  return transcription.text;
}