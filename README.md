# Signetrix — In-app AI upgrade

This Vercel-ready project preserves the existing Signetrix interface and local rule-based checks while routing the Copilot and three review tools through a server-side AI endpoint:

- In-App AI Copilot
- Intelligent Content Rewriter
- Brand Voice Intelligence
- Explainable AI Review

The review tools reuse the existing Content Review screen. AI-generated findings are shown separately from the local heuristic scores. The rewrite can be applied to the existing draft and re-analysed by the original checker. API keys are never stored in the HTML.

## Deploy

1. Extract this ZIP and upload the contents of `signetrix-ai/` to the root of a GitHub repository (`index.html`, `api/copilot.js`, and `vercel.json`).
2. Import the repository into Vercel and deploy it.
3. In Vercel → Project Settings → Environment Variables, configure the provider using the section below.
4. Redeploy after changing environment variables.

## Environment variables

Choose one provider. Set `AI_PROVIDER` to `gemini`, `openai`, `anthropic`, or `openrouter` and set `AI_API_KEY` to your provider key. Keep the key secret; never add it to `index.html`, frontend JavaScript, or a public GitHub repository.

| Variable | Purpose |
|---|---|
| `AI_PROVIDER` | `gemini`, `openai`, `anthropic`, or `openrouter` |
| `AI_API_KEY` | Your secret API key for the chosen provider |
| `AI_MODEL` | Optional model override; leave unset to use the backend default |
| `AI_BASE_URL` | Optional OpenAI-compatible API base URL; generally leave unset for OpenAI/OpenRouter defaults |
| `APP_URL` | Optional app URL, used as the OpenRouter referer |

Alternatively, if you do not set `AI_PROVIDER`/`AI_API_KEY`, the endpoint can detect provider-specific variables: `GEMINI_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, or `OPENROUTER_API_KEY`. Provider defaults are selected in that order only when the matching key exists.

Default models in this code are `gemini-2.5-flash`, `gpt-4.1-mini`, `claude-3-7-sonnet-latest`, and `openai/gpt-4.1-mini` for OpenRouter. Availability depends on your account/provider; if a model is not available to your key, set `AI_MODEL` to a model you can access.

## Important notes

- Opening `index.html` directly as a local file will not run the serverless API. Deploy to Vercel or run it in an environment that supports the `/api/copilot` server function.
- Usage costs, quotas, and model availability depend on the API provider and account.
- AI may be wrong and does not independently verify factual claims. Review outputs before publishing.
- Draft content and relevant Brand DNA are sent to your chosen provider when you request AI analysis. Avoid sending confidential or personal data unless you are authorised to do so.
