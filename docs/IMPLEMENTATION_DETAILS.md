# Implementation Details

This document describes the architecture, feature implementation, and core components of VoxBrowser.

## Frontend Architecture

- Built with React 19 and Vite.
- Uses local state management inside `App.tsx` for authentication, session history, navigation, and settings.
- Includes a demo authentication flow with `SignIn` and `SignUp` components.
- UI components are structured under `src/components/`.
- `src/utils/audioAssistant.ts` provides audio feedback for user interactions.

## Client Behavior

- `App.tsx` maintains:
  - authentication state
  - active page/tab state
  - profile metadata
  - app settings
  - session list history
- Sample session data is initialized in `SAMPLE_SESSIONS` and can be synced with the backend.
- User actions such as add, delete, and select session are supported.
- Server API calls are made to `/api/history` and `/api/gemini/summarize`.

## Backend Architecture

- Express server implemented in `server.ts`.
- Uses `vite` middleware in development mode.
- Serves static assets from `dist` in production mode.
- Provides API endpoints for session history, health checks, and AI summarization.
- The `GoogleGenAI` client is lazy-initialized using `@google/genai`.

## API Endpoints

- `GET /api/health`
  - Returns application health status and current timestamp.
- `GET /api/history`
  - Returns the current in-memory session history array.
- `POST /api/history`
  - Accepts a session object and stores it at the top of the history.
- `DELETE /api/history?id=<sessionId>`
  - Deletes the specified session from memory.
- `POST /api/gemini/summarize`
  - Summarizes posted transcript prompt text using Gemini.
  - Requires `GEMINI_API_KEY` in the environment.

## Build and Deployment

- `npm run dev` starts the development server with Vite middleware.
- `npm run build`:
  - Builds the frontend with Vite.
  - Bundles the backend server with esbuild to `dist/server.cjs`.
- `npm start` launches the production server from the built output.

## Important Implementation Notes

- Port is explicitly bound to `3000` in `server.ts`.
- The backend currently stores session history in memory, so it is not persistent across restarts.
- The Gemini summarization route includes a language-specific instruction for English and Spanish.
- The project uses Tailwind CSS via `@tailwindcss/vite`.
