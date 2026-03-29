# RepoLens 🔍✨

**Instant intelligence on any GitHub repository using Gemini 2.0.**

RepoLens is a powerful, AI-driven GitHub repository analyzer that helps developers understand the health, structure, and contribution-friendliness of any public codebase instantly.

![RepoLens Preview](https://via.placeholder.com/800x400?text=RepoLens+Dashboard)

## 🚀 Features

- **AI Repository Summary**: Powered by Google Gemini 2.0 Flash, get plain English explanations of what a repository does, its target audience, and suggested first issues.
- **Maintenance Health Score**: Analyzes commit frequency, PR merge rates, and issue resolution to generate a dynamic 0-100 score.
- **Contribution Friendliness**: Scans for standard files (`CONTRIBUTING.md`, `LICENSE`, `CODE_OF_CONDUCT`, PR Templates) to let you know how welcoming a codebase is.
- **PR Intelligence**: Discover average merge times, external contributor PR merge rates, and a quick verdict on how open a repo is to outside help.
- **Visual File Structure**: Instantly browse the core folder structure without leaving the dashboard.
- **Dependency Snapshot**: Detects `package.json` or `requirements.txt` to estimate project complexity.

## 🛠 Tech Stack

- **Frontend**: Next.js 14 App Router, React, Tailwind CSS, shadcn/ui, Framer Motion (via UI libs).
- **Backend API**: Next.js Route Handlers.
- **AI Integration**: `@google/generative-ai` SDK.
- **Data Source**: GitHub REST API with advanced fetching heuristics.

## 💻 Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/repolens.git
   cd repolens
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Duplicate the `.env.example` file and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```
   Fill in your tokens (see Environment Variables table below).

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `GITHUB_TOKEN` | A standard Personal Access Token (classic or fine-grained) required to bypass aggressive GitHub rate limits. |
| `GEMINI_API_KEY` | Your Google API Key for accessing Gemini 2.0. Get it from [Google AI Studio](https://aistudio.google.com/). |
| `NEXT_PUBLIC_APP_URL` | Used for fully-qualified API internal calls if necessary. Generally `http://localhost:3000` locally. |

## 🚢 Deployment Guide (Vercel)

RepoLens is optimized for edge and serverless environments, making Vercel the ideal host.

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com/) and Import your project.
3. In the Settings tab before deploying, configure your **Environment Variables**:
   - `GITHUB_TOKEN`
   - `GEMINI_API_KEY`
4. Click **Deploy**. Vercel will install dependencies, build the Next.js app, and map your API routes seamlessly.

---

*Built with passion, AI, and lots of coffee.*
