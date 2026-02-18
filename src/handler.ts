import Sentiment from "sentiment";

const analyzer = new Sentiment();

const cryptoLexicon: Record<string, number> = {
  moon: 3, mooning: 4, bullish: 3, pump: 2, breakout: 3, ath: 3,
  rally: 3, surge: 3, parabolic: 4, wagmi: 2, alpha: 2, based: 1,
  accumulate: 2, undervalued: 2, gem: 2, flip: 1, send: 1,
  bearish: -3, dump: -3, crash: -4, rug: -5, rugged: -5, scam: -4,
  rekt: -4, liquidated: -4, ngmi: -3, capitulate: -3, bleed: -2,
  bleeding: -2, overvalued: -2, ponzi: -5,
  hodl: 1, hold: 0, crab: 0, sideways: 0, consolidate: 0, dyor: 0,
};

export async function handler(input: any): Promise<any> {
  const { text } = input;
  if (!text || typeof text !== "string") throw new Error("Missing required field: text");

  const result = analyzer.analyze(text, { extras: cryptoLexicon });
  const normalized = Math.max(-1, Math.min(1, Math.round(result.comparative * 100) / 100));

  let sentiment: string;
  if (normalized > 0.3) sentiment = "bullish";
  else if (normalized > 0.05) sentiment = "slightly bullish";
  else if (normalized < -0.3) sentiment = "bearish";
  else if (normalized < -0.05) sentiment = "slightly bearish";
  else sentiment = "neutral";

  return {
    sentiment,
    score: normalized,
    comparative: result.comparative,
    tokens: result.tokens.length,
    positive: result.positive.slice(0, 5),
    negative: result.negative.slice(0, 5),
    wordCount: result.tokens.length,
    timestamp: new Date().toISOString(),
  };
}
