# Setup Instructions

Follow these steps to get VoxBrowser running locally.

## Prerequisites

- Node.js installed on your machine.
- A valid `GEMINI_API_KEY` for Google Gemini if you want AI summarization.

## Install Dependencies

1. Open a terminal in the repository root.
2. Run:
   ```bash
   npm install
   ```

## Configure Environment

1. Create an `.env.local` file in the repository root or use `.env.example` as a template.
2. Add the following environment variable:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

## Run the App in Development

1. Start the development backend and client:
   ```bash
   npm run dev
   ```
2. Open your browser to:
   ```bash
   http://localhost:3000
   ```

## Build and Run for Production

1. Build the frontend and server bundle:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```
3. The app serves static files and API routes from port `3000`.

## Notes

- The backend uses an in-memory session store, so session history is reset on server restart.
- The app is configured to bind to port `3000` as the only externally accessible port.
- If `GEMINI_API_KEY` is not set, the `/api/gemini/summarize` endpoint will fail with environment variable errors.
