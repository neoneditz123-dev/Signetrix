// API route tests using mocked Groq responses; no real API key or network needed.
const assert = require("node:assert/strict");
const handler = require("../api/ai.js");

function makeResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: "",
    status(code) { this.statusCode = code; return this; },
    setHeader(name, value) { this.headers[name] = value; return this; },
    end(value) { this.body = value; }
  };
}

async function request(body, method = "POST") {
  const res = makeResponse();
  await handler({ method, body }, res);
  return { status: res.statusCode, body: JSON.parse(res.body || "{}") };
}

(async () => {
  const originalFetch = global.fetch;
  const originalKey = process.env.GROQ_API_KEY;
  try {
    delete process.env.GROQ_API_KEY;
    assert.equal((await request({ action: "copilot", payload: { message: "Hi", messages: [] } })).status, 500);

    process.env.GROQ_API_KEY = "test-placeholder-not-a-real-key";
    assert.equal((await request({}, "GET")).status, 405);
    assert.equal((await request({ action: "unknown", payload: {} })).status, 400);
    assert.equal((await request({ action: "copilot", payload: { message: 42, messages: [] } })).status, 400);

    const fixtures = {
      compliance: { draft: "Sample draft", brand: {} },
      brand_dna: { brand: {} },
      impact: { versionA: "Version A", versionB: "Version B", brand: {} },
      copilot: { message: "Help me navigate", messages: [] }
    };

    for (const [action, payload] of Object.entries(fixtures)) {
      const expected = { action };
      global.fetch = async (url, options) => {
        assert.equal(url, "https://api.groq.com/openai/v1/chat/completions");
        assert.equal(options.headers.Authorization, "Bearer test-placeholder-not-a-real-key");
        const sent = JSON.parse(options.body);
        assert.equal(sent.model, "openai/gpt-oss-20b");
        assert.deepEqual(sent.response_format, { type: "json_object" });
        return {
          ok: true,
          status: 200,
          json: async () => ({
            model: "openai/gpt-oss-20b",
            choices: [{ message: { content: JSON.stringify(expected) } }]
          })
        };
      };
      const result = await request({ action, payload });
      assert.equal(result.status, 200, `${action} should return HTTP 200`);
      assert.deepEqual(result.body.result, expected);
      assert.equal(result.body.model, "openai/gpt-oss-20b");
    }

    global.fetch = async () => ({
      ok: false,
      status: 429,
      json: async () => ({ error: { message: "rate limit reached" } })
    });
    const limited = await request({ action: "copilot", payload: fixtures.copilot });
    assert.equal(limited.status, 429);
    assert.match(limited.body.error, /free-tier rate limit/i);

    global.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({ choices: [{ message: { content: "not json" } }] })
    });
    const invalidJson = await request({ action: "copilot", payload: fixtures.copilot });
    assert.equal(invalidJson.status, 502);
    assert.match(invalidJson.body.error, /invalid structured response/i);

    console.log("API tests passed: key handling, method validation, payload validation, all four actions, rate limiting, and invalid JSON.");
  } finally {
    global.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = originalKey;
  }
})().catch(error => {
  console.error("API tests failed:", error);
  process.exitCode = 1;
});
