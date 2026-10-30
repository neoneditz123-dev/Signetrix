# Signetrix AI upgrade

This package keeps the existing Signetrix standalone interface and adds three Gemini-powered features:
- AI Brand Compliance Reviewer
- Brand DNA Intelligence Engine
- AI Brand Impact Simulator

## Deploy to Vercel

1. Upload the contents of this folder to a new GitHub repository (or replace the files in your existing Signetrix repository after backing it up).
2. Import that repository into Vercel as a project.
3. In Vercel: Project → Settings → Environment Variables, add:
   - Name: `GEMINI_API_KEY`
   - Value: your Gemini API key
   - Environments: Production, Preview, Development (as needed)
4. Optionally add `GEMINI_MODEL` with value `gemini-3.8-flash` if you want to set the model explicitly.
5. Redeploy after adding/changing environment variables.
6. Open the deployed site and test each AI feature.

Never put the key in `index.html`, GitHub, chat, or a public file. Do not commit `.env`.

## Local testing

Requires Node.js 20+ and Vercel CLI. Set `GEMINI_API_KEY` in your local environment (not in source code), then run `vercel dev`.

## Important notes

- The AI features send the draft and Brand DNA fields to Google's Gemini API for processing. Do not submit confidential, personal, or unpublished sensitive material unless you have permission.
- AI output can be wrong. It does not independently verify claims, evidence, legal compliance, or audience outcomes. Human review is required.
- The serverless endpoint is publicly reachable on a public deployment. For a public production launch, add authentication and server-side rate limiting/usage controls before sharing it widely; otherwise visitors may consume your project's API quota.
- Existing heuristic checks and browser-local storage remain in place. AI responses are not silently saved as approvals or used to overwrite drafts.

## Signetrix Copilot
The floating **Signetrix Copilot** is available from every app section. It can answer usage questions, explain the current review context and suggest a section to open. It uses the same `/api/ai` Gemini proxy and `GEMINI_API_KEY` environment variable. It does not directly edit records or run actions; navigation is user-confirmed with an Open button. Conversation history is kept in the current page session only. The current brand profile and visible review summary/findings are sent with a Copilot message to Gemini to provide context, so avoid entering confidential or sensitive content.
