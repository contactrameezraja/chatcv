import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 8000;

// --- Config ---
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const DAILY_LIMIT = parseInt(process.env.DAILY_MESSAGE_CAP || '50');

// --- In-memory rate limiting ---
const dailyCounts = new Map();

function checkRateLimit() {
  const today = new Date().toISOString().split('T')[0];

  // Clean up old dates
  for (const [key] of dailyCounts) {
    if (key !== today) dailyCounts.delete(key);
  }

  const count = dailyCounts.get(today) || 0;
  if (count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0, count };
  }

  dailyCounts.set(today, count + 1);
  return { allowed: true, remaining: DAILY_LIMIT - count - 1, count: count + 1 };
}

// --- Middleware ---
app.use(express.json({ limit: '50kb' }));

// --- API route ---
app.post('/api/chat', async (req, res) => {
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  const rateLimit = checkRateLimit();
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: 'daily_limit_reached',
      message: `Daily message limit (${DAILY_LIMIT}) reached. Please try again tomorrow.`,
      remaining: 0,
    });
  }

  try {
    const { system, messages } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system,
        messages,
      }),
    });

    const data = await response.json();
    res.setHeader('X-Remaining-Messages', rateLimit.remaining);
    return res.json(data);
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
});

// --- Serve static frontend ---
app.use(express.static(join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// --- Start ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`ChatCV running on http://localhost:${PORT}`);
  console.log(`Daily message cap: ${DAILY_LIMIT}`);
  if (!ANTHROPIC_API_KEY) {
    console.warn('WARNING: ANTHROPIC_API_KEY is not set!');
  }
});
