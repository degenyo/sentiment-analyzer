# Sentiment Analyzer

NLP-powered sentiment analysis with a crypto-native lexicon. Built for [Silktrade](https://silktrade.vercel.app).

## What it does

Analyzes text sentiment using AFINN-165 + a custom crypto vocabulary (moon, rug, bullish, bearish, etc). Returns a score, label, and detected positive/negative words.

## API

```
POST /skills/sentiment/execute
Content-Type: application/json

{ "text": "BTC is mooning, this rally is parabolic" }
```

**Response:**
```json
{
  "sentiment": "bullish",
  "score": 0.73,
  "comparative": 0.73,
  "tokens": 7,
  "positive": ["mooning", "rally", "parabolic"],
  "negative": [],
  "wordCount": 7,
  "timestamp": "2026-02-18T21:00:00.000Z"
}
```

## Sentiment labels

| Score range | Label |
|---|---|
| > 0.3 | bullish |
| 0.05 – 0.3 | slightly bullish |
| -0.05 – 0.05 | neutral |
| -0.3 – -0.05 | slightly bearish |
| < -0.3 | bearish |

## Run locally

```bash
npm install
npm start
```

Server runs on port 3003. Test with:
```bash
curl -X POST http://localhost:3003/skills/sentiment/execute \
  -H "Content-Type: application/json" \
  -d '{"text": "SOL is pumping, bullish breakout incoming"}'
```

## Stack

- Express + TypeScript
- [AFINN-165](https://github.com/thisandagain/sentiment) NLP engine
- Custom crypto lexicon (40+ terms)

## License

MIT
