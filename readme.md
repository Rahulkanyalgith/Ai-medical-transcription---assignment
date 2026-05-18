

## How to Run the Project

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Ensure you have your `.env` configured with the necessary API keys for transcription, e.g.:
   ```dotenv
   OPENAI_API_KEY=your_api_key_here
   ```

3. **Start the server:**
   ```bash
   npm run dev - for development with auto-reload using nodemon
   npm start - for the server to run without auto-reload
   
   ```



### Approach

The approach is to make the routes for the transcribe, correction, cleaning, and extraction services as modular as possible. Each service is responsible for a specific part of the pipeline, allowing for easier maintenance and potential future enhancement.

Create the services folder for the individual services, and a utils folder for the medical

whisperServices.js -  Interfaces with the LLM/Whisper API for Speech-to-Text
correctionService.js - Corrects medical jargon misspellings
cleaningService.js   - Strips filler words from the transcript
extractService.js    - Extracts medical conditions from text

# utils 
Utils/medicalDictionary.js - A dictionary mapping misspelled words to correct medical 


public/(html,css,js) folder - Frontend code











