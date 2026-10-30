# Signetrix — Brand Governance Studio

Signetrix is a browser-based brand content analysis and governance application. This repository keeps the supplied standalone HTML frontend and its Vercel serverless API route. AI requests are sent from the browser to `/api/ai`; the server route calls GroqCloud and keeps the API key private.

## Existing application features

The supplied `index.html` includes the dashboard, content review and local heuristic checks, Brand DNA profile, Brand DNA Simulator (Version A/B comparison), Brand Drift Radar, review history, score graphs, governance toolkit, Brand Memory Map, settings/themes, and the floating Signetrix Copilot.

The AI endpoint supports these actions:
- `compliance` — AI-assisted brand compliance review
- `brand_dna` — structured Brand DNA operating guide
- `impact` — AI comparison of Version A and Version B
- `copilot` — contextual in-app assistant

The app's local review and history functionality remains browser-based. Local heuristic scores are indicators, not proof of compliance. AI suggestions require human review and do not independently verify claims or legal compliance.

## Technology

- Frontend: standalone HTML, CSS, and browser JavaScript (`index.html`)
- Backend: Vercel serverless function (`api/ai.js`)
- AI provider: GroqCloud Chat Completions API
- Default model: `openai/gpt-oss-20b`
- Deployment: Vercel
- Runtime: Node.js 20+
- Dependencies: none required for the supplied app

## Cost and model notes

The default model ID is `openai/gpt-oss-20b`. It is listed in Groq's current model documentation and supports JSON output. Groq's Free Plan has usage limits; when a free-tier limit is reached, requests are rate-limited rather than silently switching to a paid provider. **Stay on Groq's Free Plan and do not upgrade to the Developer tier** if your budget must remain ₹0. Groq's paid Developer tier is usage-billed. Availability and limits can change, so check the official documentation before deployment:

- Models: https://console.groq.com/docs/models
- Chat Completions API: https://console.groq.com/docs/api-reference
- Rate limits: https://console.groq.com/docs/rate-limits
- Billing FAQ: https://console.groq.com/docs/billing-faqs

No paid fallback, automatic model switching, or automatic retry loop is implemented.

## Environment variables

Set these in **Vercel → Project → Settings → Environment Variables**:

| Name | Required | Value |
|---|---:|---|
| `GROQ_API_KEY` | Yes | Your private GroqCloud API key |
| `GROQ_MODEL` | No | Defaults to `openai/gpt-oss-20b` |

The `.env.example` file contains placeholders only. Never paste a real key into source code, `index.html`, GitHub, a public issue, or a chat. Add the real key directly in Vercel. If you use a local `.env` file for local development, keep it untracked and private.

## Run locally

1. Install Node.js 20 or later.
2. Download/clone this repository.
3. Add a local `.env` file based on `.env.example` and put your own key in it. Do not commit `.env`.
4. Install the Vercel CLI if you want to run the serverless route locally.
5. Run `vercel dev` from the project folder.
6. Open the local URL printed by Vercel.

The browser-only parts of the application can be opened as a static HTML file, but AI features require the `/api/ai` route and a valid `GROQ_API_KEY`.

## Validate before deployment

Run:

```bash
npm run check
npm test
```

`npm run check` validates the syntax of `api/ai.js` and every inline JavaScript block in `index.html`. `npm test` runs mocked API-route tests for key handling, request validation, all four AI actions, rate limiting, and malformed model output. These tests do not call GroqCloud or prove that a real API key is valid.

## Deploy to GitHub and Vercel

### A. Back up your existing repository

1. Open your existing GitHub repository.
2. Make sure your current work is committed, or download a ZIP backup before replacing files.
3. Do not delete or overwrite your repository history.

### B. Update the repository

1. Extract the project ZIP.
2. Open the extracted `Signetrix-AI` folder.
3. Copy its contents into your existing repository working folder.
4. Keep the folder structure exactly as supplied: `index.html`, `api/ai.js`, `vercel.json`, `package.json`, `scripts/check.js`, and the supporting files should be at the repository root / correct subfolders.
5. Review the changes, then run `npm run check`.

### C. Commit and push

From a terminal opened in the repository folder:

```bash
git status
git add index.html api/ai.js .env.example README.md package.json scripts/check.js vercel.json .gitignore
git commit -m "Migrate Signetrix AI backend to GroqCloud"
git push
```

If Git says there is nothing to commit, check that the updated files were copied into the correct repository folder.

### D. Configure Vercel

1. Open the existing Vercel project `signetrix-by-pp`.
2. Go to **Settings → Environment Variables**.
3. Add `GROQ_API_KEY` and paste the key directly into the Value field.
4. Optionally add `GROQ_MODEL` with `openai/gpt-oss-20b`.
5. Select Production, Preview, and Development as needed.
6. Remove the old `GEMINI_API_KEY` and `GEMINI_MODEL` variables after confirming no other deployed branch still depends on them.
7. Save the variables.
8. Go to Deployments and redeploy the latest commit.

### E. Test the deployed app

1. Open the Vercel deployment.
2. Confirm the dashboard loads and navigate through the existing sections.
3. Run a content review with a short, non-sensitive sample draft.
4. Run Brand DNA Intelligence after entering a sample Brand DNA profile.
5. Compare two short versions in the Brand DNA Simulator.
6. Open Signetrix Copilot and send a simple app-navigation question.
7. Confirm the API returns structured results and that an intentionally missing/invalid key produces a clear error.
8. Check the Vercel Function logs if an API request fails.

## API contract

The frontend continues to call:

`POST /api/ai`

Request body:

```json
{
  "action": "compliance",
  "payload": {
    "brand": {},
    "draft": "Sample content"
  }
}
```

Supported actions: `compliance`, `brand_dna`, `impact`, and `copilot`.

Successful response:

```json
{
  "result": {},
  "model": "openai/gpt-oss-20b"
}
```

Errors return a JSON object with an `error` message and an appropriate HTTP status. The API key is read only from the server environment.

## Security and privacy notes

- The API key is never sent to the browser.
- The API route accepts POST only, validates the action and text fields, and limits request duration.
- There is no automatic retry or paid fallback.
- The public endpoint does not include user authentication or per-user quotas. A public deployment can be used by other visitors and consume the project's free-tier quota. Keep the deployment private/unshared while testing, and consider access controls before a public launch.
- Do not submit confidential, personal, or unpublished sensitive material unless you have permission.

## Known limitations of this handover

- The ZIP supplied for this handover contains a single-file frontend and API route, not the complete Git repository or its commit history. This update preserves the supplied application; it cannot verify files or features that may exist only in a different GitHub branch.
- Browser local storage is device/browser-specific and is not a cloud database.
- AI features cannot be fully tested until a valid Groq API key is configured and the app is run through Vercel.
- The exact free-tier quotas depend on the Groq account and may change. Hitting a free-tier limit returns an error; the app will not upgrade or switch providers automatically.
