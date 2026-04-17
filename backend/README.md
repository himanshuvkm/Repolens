# GitHub Contributor Intelligence Backend

This backend is a standalone Fastify service that lives alongside the existing Next.js frontend.

## What it does

- Fetches GitHub repository, issue, PR, review, and contributor data
- Persists normalized data in PostgreSQL through Prisma
- Uses Redis for GitHub API response caching and BullMQ coordination
- Computes repository analytics and a rule-based health score
- Uses Gemini only for natural-language explanations
- Accepts GitHub webhooks to re-queue analysis in near real time

## Primary endpoints

- `GET /repo/:owner/:repo`
- `POST /analyze`
- `GET /insights/:repo?owner=:owner`
- `POST /webhooks/github`
- `GET /health`

## Suggested environment

See `.env.example` for the required variables.
