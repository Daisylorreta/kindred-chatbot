# Kindred: relationship and community advice chatbot

## Run it
Terminal 1 (backend):
  cd server
  npm install
  cp .env.example .env     # then paste your Anthropic API key
  npm run dev

Terminal 2 (frontend):
  cd client
  npm install
  cp .env.example .env
  npm run dev

Open http://localhost:5173

## Deploy
- Put the server on Render, Railway, or similar. Set ANTHROPIC_API_KEY and CLIENT_ORIGIN (your frontend URL) as environment variables.
- Put the client on Vercel or Netlify. Set VITE_API_URL to your server URL.
- Never commit .env files. Add `.env` to .gitignore.