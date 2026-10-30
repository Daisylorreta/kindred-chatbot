# Kindred

An AI chatbot that gives advice on **friendship, relationships, marriage, and communal living**, and politely declines everything else.

Built with React, Node.js, Express, and the Google Gemini API.

> Status: runs locally. Not deployed yet.

![Kindred splash page](screenshots/splash.png)

## Features

- **Stays on topic.** A system prompt limits Kindred to friendship, romantic relationships, marriage, and shared living (roommates, family compounds, neighbours). Off-topic questions and attempts to override its rules are declined.
- **Safety-minded replies.** If someone describes abuse or self-harm, Kindred responds with care and encourages them to reach a trusted person or local emergency services.
- **Culturally aware advice.** The prompt tells the bot not to assume a nuclear-family model, so extended family and community living are treated as normal.
- **Chat history.** Previous conversations are listed in a side panel, can be reopened or deleted, and are saved in the browser with `localStorage`.
- **Light and dark mode.** Switch themes from Settings. The choice is remembered.
- **Splash page.** A drawn communal-compound scene that switches to a night version in dark mode.
- **Responsive layout.** The history panel becomes a slide-in menu on phones.

## Screenshots

| Light mode                           | Dark mode                          |
| ------------------------------------ | ---------------------------------- |
| ![Light mode](screenshots/light.png) | ![Dark mode](screenshots/dark.png) |

## How it works

```
React (Vite) client  ->  Express server  ->  Gemini API
```

The browser never sees the API key. The client sends the conversation to the Express server, which adds the system prompt, calls Gemini, and returns the reply.

Server protections:

- Rate limit of 10 messages per minute per IP
- Messages capped at 1,000 characters, and only the last 20 messages are sent to the model
- Input validation on every request
- Retries once, then falls back to a second model if the first is busy
- API key kept in a `.env` file that is excluded from Git

## Tech stack

| Part     | Tools                                              |
| -------- | -------------------------------------------------- |
| Frontend | React, Vite, plain CSS                             |
| Backend  | Node.js, Express, express-rate-limit, cors, dotenv |
| AI       | Google Gemini API (`@google/genai`)                |

## Project structure

```
kindred-chatbot/
  client/
    src/
      App.jsx        chat screen, history panel, settings
      Splash.jsx     splash page illustration
      App.css        styles and light/dark themes
    server/
      index.js       Express API and system prompt
      package.json
```

## Run it locally

You need Node.js and a free Gemini API key from [Google AI Studio](https://aistudio.google.com).

**1. Clone the project**

```bash
git clone https://github.com/daisylorreta/kindred-chatbot.git
cd kindred-chatbot
```

**2. Start the server**

```bash
cd client/server
npm install
```

Create a file named `.env` in `client/server` with:

```
GEMINI_API_KEY=your-key-here
CLIENT_ORIGIN=http://localhost:5173
```

Then run:

```bash
npm run dev
```

It should print `Kindred server running on port 3000`.

**3. Start the client** in a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the `localhost` link it prints (usually `http://localhost:5173`).

> On Windows PowerShell, use `npm.cmd` instead of `npm` if scripts are blocked.

## What I learned

- Building a React interface with state, effects, and `localStorage` persistence
- Keeping secrets on the server instead of in frontend code
- Shaping model behaviour with a system prompt, and testing it with off-topic and rule-breaking messages
- Handling real API problems: wrong model names, rate limits, and temporary overload errors
- Theming with CSS variables, and making a layout work on phones

## Possible next steps

- Stream replies as they are written
- User accounts and chat history that syncs across devices
- Deploy the server and client online

## Disclaimer

Kindred is an AI, not a counsellor. In an emergency, contact your local emergency services.

## Author

Built by [daisylorreta](https://github.com/daisylorreta).
