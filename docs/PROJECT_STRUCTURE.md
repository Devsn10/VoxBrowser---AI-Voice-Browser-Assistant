# Project Structure

This repository contains a React + Express voice assistant application named VoxBrowser.

## Root Files

- `.env.example` - sample environment configuration file.
- `.gitignore` - specifies files and folders excluded from Git.
- `README.md` - top-level guidance for running and deploying the app.
- `metadata.json` - project metadata for AI or app integration.
- `package.json` - dependency and script definitions.
- `server.ts` - Express backend server with development middleware and API routes.
- `tsconfig.json` - TypeScript compiler configuration.
- `vite.config.ts` - Vite configuration for the React frontend.
- `index.html` - page shell loaded by Vite in development and build.

## Source Code

### `src/`

- `src/App.tsx` - main React application shell, authentication flow, navigation, and session management.
- `src/types.ts` - shared TypeScript interfaces for sessions, profile data, and settings.
- `src/index.css` - global styling and theme base styles.
- `src/main.tsx` - application entry point that mounts the React app.
- `src/utils/audioAssistant.ts` - audio helper for UI feedback, voice prompts, and beep sounds.

### `src/components/`

- `Dashboard.tsx` - primary dashboard view with quick access to app details and sections.
- `History.tsx` - session history list and session detail interaction.
- `Library.tsx` - saved transcription/library view.
- `SettingsDrawer.tsx` - app settings panel and configurator.
- `SignIn.tsx` - sign-in form UI for demo authentication.
- `SignUp.tsx` - sign-up form UI for new user registration.

## Application Flow

1. The client runs in the browser using Vite and React.
2. `App.tsx` manages authentication, navigation tabs, and session data.
3. The backend server from `server.ts` provides both API routes and Vite middleware in development.
4. Voice and AI features are supported through the `AudioAssistant` utility and Gemini summarization endpoint.

## Backend APIs

- `GET /api/health` - health check endpoint.
- `GET /api/history` - returns stored session history.
- `POST /api/history` - saves or updates a session entry.
- `DELETE /api/history?id=<sessionId>` - deletes a saved session.
- `POST /api/gemini/summarize` - sends transcription text to Google Gemini for summary generation.
