# AI Learning Path Generator

Your personal AI mentor. Turn any ambitious goal into a structured, daily learning plan and master new skills faster than ever before.

## Features

- 🎯 Set learning goals with customizable timelines
- 📊 Generate structured daily learning plans
- 🤖 Powered by Google Gemini AI
- 📱 Modern React + TypeScript interface
- ⚡ Built with Vite for fast development

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root directory and set your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

## Tech Stack

- React 19
- TypeScript
- Vite
- Google Gemini AI API

## Getting Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env.local` file

## Deployment

This project is configured for easy deployment on various platforms. Configuration files are already included in the repository.

### Deploy on Vercel (Recommended)

1. Go to [Vercel](https://vercel.com) and sign in with GitHub
2. Click "New Project" and import your repository
3. Add environment variable: `GEMINI_API_KEY` with your API key
4. Click "Deploy"

Your site will be live in under 2 minutes! 🚀

### Deploy on Netlify

1. Go to [Netlify](https://netlify.com) and sign in with GitHub
2. Click "Add new site" → "Import an existing project"
3. Select your repository
4. Go to Site settings → Environment variables
5. Add `GEMINI_API_KEY` with your API key
6. Click "Deploy site"

### Deploy on Cloudflare Pages

1. Go to [Cloudflare Pages](https://dash.cloudflare.com)
2. Connect to Git → GitHub and select your repository
3. Configure:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Add environment variable: `GEMINI_API_KEY`
5. Click "Save and Deploy"

## License

MIT
