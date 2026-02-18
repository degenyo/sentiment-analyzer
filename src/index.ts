import express from "express";
import Sentiment from "sentiment";

const app = express();
app.use(express.json());

const analyzer = new Sentiment();

const cryptoLexicon: Record<string, number> = {
  // Bullish
  moon: 3, mooning: 4, bullish: 3, pump: 2, breakout: 3, ath: 3,
  rally: 3, surge: 3, parabolic: 4, wagmi: 2, alpha: 2, based: 1,
  accumulate: 2, undervalued: 2, gem: 2, flip: 1, send: 1,
  // Bearish
  bearish: -3, dump: -3, crash: -4, rug: -5, rugged: -5, scam: -4,
  rekt: -4, liquidated: -4, ngmi: -3, capitulate: -3, bleed: -2,
  bleeding: -2, overvalued: -2, ponzi: -5,
  // Neutral / mild
  hodl: 1, hold: 0, crab: 0, sideways: 0, consolidate: 0, dyor: 0,
};

app.post("/skills/sentiment/execute", (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== "string") {
    res.status(400).json({ error: "Missing required field: text" });
    return;
  }

  const result = analyzer.analyze(text, { extras: cryptoLexicon });

  const raw = result.comparative;
  const normalized = Math.max(-1, Math.min(1, Math.round(raw * 100) / 100));

  let sentiment: string;
  if (normalized > 0.3) sentiment = "bullish";
  else if (normalized > 0.05) sentiment = "slightly bullish";
  else if (normalized < -0.3) sentiment = "bearish";
  else if (normalized < -0.05) sentiment = "slightly bearish";
  else sentiment = "neutral";

  const positiveWords = result.positive.length > 0 ? result.positive.slice(0, 5) : [];
  const negativeWords = result.negative.length > 0 ? result.negative.slice(0, 5) : [];

  res.json({
    sentiment,
    score: normalized,
    comparative: result.comparative,
    tokens: result.tokens.length,
    positive: positiveWords,
    negative: negativeWords,
    wordCount: result.tokens.length,
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (_req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Sentiment Analyzer running on :${PORT}`));
