## How to Run the Project

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

3. **Start the server:**
   ```bash
   # For development with auto-reload using nodemon
   npm run dev 

4. **Access the application:**
    navigate to `http://localhost:5000` to access the frontend
   ```

---

## Approach

The approach is to make the routes for the transcribe, correction, cleaning, and extraction services as modular as possible. Each service is responsible for a specific part of the pipeline, allowing for easier maintenance and potential future enhancement.

The project is structured with a modular `services` folder for the individual logic components, and a `utils` folder for shared configurations:

### Services (`src/services/`)
- **`whisperServices.js`** — Interfaces with the LLM/Whisper API for Speech-to-Text.
- **`correctionService.js`** — Corrects medical jargon misspellings.
- **`cleaningService.js`** — Strips filler words from the transcript.
- **`extractService.js`** — Extracts medical conditions from text.

### Utilities (`src/utils/`)
- **`medicalDictionary.js`** — A dictionary mapping misspelled words to correct medical terminology.

### Frontend (`public/`)
- Contains the static files (`HTML`, `CSS`, and `JS`) for the frontend user interface.











