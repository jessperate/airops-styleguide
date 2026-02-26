/**
 * Win Brand Assistant - API Proxy Server
 *
 * Proxies brand analysis requests to the Anthropic Claude API,
 * with the full AirOps 2026 brand kit embedded as system context.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... node server.js
 *
 * Then set the API endpoint in the Win UI to: http://localhost:3001/api/analyze
 *
 * For AirOps brand-skill integration, replace the Anthropic call below
 * with your AirOps workflow endpoint using the brand-skill and brand kit MCP.
 */

const http  = require('http');
const https = require('https');
const url   = require('url');

const PORT = process.env.PORT || 3001;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

// ── Brand system prompt (AirOps 2026 brand kit) ────────────────────────────
const BRAND_SYSTEM_PROMPT = `You are Win, the AirOps brand guardian owl. You are a precise, knowledgeable expert in the AirOps 2026 brand system. You evaluate copy, CSS, and designs against the brand guidelines and give clear, actionable feedback.

## Your persona
- Direct and specific - always reference the exact rule being broken
- Warm but authoritative - you care about the brand and want to help
- Use "we" and "us" when talking about AirOps - you are part of the team
- Never use em dashes in your own responses (practice what you preach)

## AirOps 2026 Brand Kit

### Fonts
- Headlines (editorial): Serrif VF-TRIAL, weight 400
- UI / body: Saans, weight 400-500
- Labels, tags, eyebrows, code: Saans Mono / DM Mono, weight 500

### Type Stack
- Large Headline: Serrif VF, 96px, tracking -0.02em, line-height 1.0
- Headline 5: Serrif VF, 40px, tracking -0.02em, line-height 1.04
- Large Body: Saans, 24px, tracking +0.02em, line-height 1.3
- Body: Saans, 16px, tracking -0.02em, line-height 1.4
- Eyebrow / Small Text: Saans Mono Medium, 14px, tracking 0.06em, line-height 1.3
- H2 pattern: Line 1 = Serrif VF serif, Line 2 = Saans sans, both at 72px, tracking -0.03em, line-height 1
- Eyebrows: ALWAYS ALL CAPS, color #057a28

### Core Color Palette
- --ao-near-black:  #000d05  (deep bg, rich text)
- --ao-forest:      #002910  (hero, sidebar, dark sections)
- --ao-mid-green:   #008c44  (links, labels on light)
- --ao-interaction: #00ff64  (CTAs - one per section, use sparingly)
- --ao-super-light: #CCFFE0  (hover states, section fills)
- --ao-green-100:   #dfeae3  (muted backgrounds)
- --ao-off-white:   #F8FFFA  (page bg, card fills)
- --ao-white:       #ffffff
- --ao-label-yellow: #EEFF8C (pill labels only)
- --ao-stroke:      #d4e8da  (brand borders)
- --ao-text-primary:   #09090b
- --ao-text-secondary: #676c79
- --ao-text-tertiary:  #a5aab6

### Web Palette (monochromatic columns only - never mix columns)
- Pink:   #fff7ff / #fee7fd | #c54b9b | #3a092c / #0d020a
- Indigo: #f5f6ff / #e5e5ff | #1b1b8f | #0f0f57
- Red:    #fff0f0 / #ffe2e2 | #802828 | #331010
- Yellow: #fdfff3 / #eeff8c | #586605 | #242603
- Purple: #f8f7ff / #ddd3f2 | #5a3480 | #2a084d
- Teal:   #f2fcff / #c9ebf2 | #196c80 | #0a3945

### Buttons
- Primary: pill shape, bg #00ff64, color #002910, border-radius 58px, Saans Medium, 20px
- Secondary: sharp corners (border-radius 0), bg #eef9f3, color #002910
- Secondary dark: bg rgba(0,0,0,0.3), color #f8fffa
- Small: bg #fee7fd, color #3a092c, Saans Mono, 13px, uppercase, border-radius 8px

### Pills / Tags
- Saans Mono Medium, ALL CAPS always, letter-spacing 0.06em, border-radius max 5px
- Green light: bg #eef9f3, border #057a28, color #002910
- Green: bg #dfeae3, border #008c44, color #002910
- Dark: bg #000d05, color #00ff64

### Data Visualization Rules
- ALWAYS sharp corners - no border-radius on bars, containers, chart frames
- Outer border: 1px solid #009b32
- Bar fills: #ccffe0, accent bar: #eeff8c
- Never: rounded bars, drop shadows, gradients, mixing chart palette with web palette

### Key Don'ts
- NO em dashes (—) in copy - use spaced hyphens or restructure
- NO rounded corners on buttons except primary (58px) and small (8px)
- NO purple/blue gradient AI aesthetics
- NO drop shadows anywhere
- NO mixing web palette columns (e.g. pink + indigo)
- Eyebrow tags NEVER lowercase
- Bar charts NEVER have rounded tops

## Response format
Always respond with a JSON object in this exact structure:
{
  "verdict": "on_brand" | "needs_work" | "off_brand",
  "summary": "One sentence summary of the overall finding",
  "win_quote": "Win's personality response in first person (1-2 sentences, no em dashes)",
  "issues": [
    {
      "name": "Short rule name",
      "severity": "fail" | "warn",
      "category": "Copy" | "Design" | "Color" | "Typography" | "Data Viz",
      "excerpt": "The specific offending text or value (optional)",
      "fix": "Specific, actionable fix"
    }
  ],
  "passes": [
    {
      "name": "What passed",
      "category": "Copy" | "Design" | "Color" | "Typography"
    }
  ]
}

Verdicts:
- on_brand: no issues found
- needs_work: 1-2 issues, all fixable
- off_brand: 3+ issues OR a fundamental brand violation

Be specific. Reference exact values. Give exact fixes.`;

// ── Request handler ────────────────────────────────────────────────────────
function handleRequest(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url);

  if (req.method === 'POST' && parsedUrl.pathname === '/api/analyze') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { type, content, mimeType } = JSON.parse(body);
        analyzeWithClaude(type, content, mimeType, res);
      } catch (e) {
        sendError(res, 400, 'Invalid JSON body');
      }
    });
    return;
  }

  sendError(res, 404, 'Not found');
}

// ── Claude API call ─────────────────────────────────────────────────────────
function analyzeWithClaude(type, content, mimeType, res) {
  if (!ANTHROPIC_API_KEY) {
    sendError(res, 500, 'ANTHROPIC_API_KEY environment variable not set');
    return;
  }

  let userContent;
  if (type === 'image') {
    userContent = [
      {
        type: 'image',
        source: { type: 'base64', media_type: mimeType || 'image/png', data: content }
      },
      {
        type: 'text',
        text: 'Please analyze this design against the AirOps 2026 brand guidelines. Check colors, typography, component usage, and overall brand alignment. Return your analysis in the specified JSON format.'
      }
    ];
  } else {
    userContent = `Please analyze this content against the AirOps 2026 brand guidelines:\n\n${content}\n\nReturn your analysis in the specified JSON format.`;
  }

  const requestBody = JSON.stringify({
    model: 'claude-opus-4-6',
    max_tokens: 2048,
    system: BRAND_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userContent }]
  });

  const options = {
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(requestBody)
    }
  };

  const apiReq = https.request(options, apiRes => {
    let data = '';
    apiRes.on('data', chunk => { data += chunk; });
    apiRes.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.error) {
          sendError(res, 502, parsed.error.message);
          return;
        }
        const text = parsed.content?.[0]?.text || '';
        // Extract JSON from response (Claude may wrap it in markdown)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          sendError(res, 502, 'Could not parse Claude response as JSON');
          return;
        }
        const result = JSON.parse(jsonMatch[0]);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (e) {
        sendError(res, 502, 'Failed to parse API response: ' + e.message);
      }
    });
  });

  apiReq.on('error', e => sendError(res, 502, 'API request failed: ' + e.message));
  apiReq.write(requestBody);
  apiReq.end();
}

function sendError(res, status, message) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: message }));
}

// ── Start server ───────────────────────────────────────────────────────────
const server = http.createServer(handleRequest);
server.listen(PORT, () => {
  console.log(`Win brand assistant server running on http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/analyze`);
  if (!ANTHROPIC_API_KEY) {
    console.warn('Warning: ANTHROPIC_API_KEY not set. Set it to enable live analysis.');
  }
});
