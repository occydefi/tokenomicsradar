/**
 * /api/reconsider
 * AI-powered score reconsideration endpoint.
 * User presents an argument → AI evaluates against the tokenomics data.
 * Anti-sycophancy: AI fact-checks the user's claim, does NOT just accept it.
 * Only adjusts score based on verifiable structural tokenomics facts.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ReconsiderRequest {
  tokenName: string;
  tokenSymbol: string;
  currentScore: number;
  currentVerdict: string;
  scores: {
    supply: number;
    distribution: number;
    vesting: number;
    utility: number;
    treasury: number;
  };
  userArgument: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tokenName, tokenSymbol, currentScore, currentVerdict, scores, userArgument } =
    req.body as ReconsiderRequest;

  if (!userArgument || userArgument.length < 20) {
    return res.status(400).json({ error: 'Argument too short (min 20 chars)' });
  }

  const systemPrompt = `You are Occy, a no-bullshit crypto tokenomics analyst.
You have just analyzed ${tokenName} (${tokenSymbol}) and assigned a score of ${currentScore}/10 (verdict: ${currentVerdict}).

Sub-scores:
- Supply: ${scores.supply}/10
- Distribution: ${scores.distribution}/10
- Vesting: ${scores.vesting}/10
- Utility: ${scores.utility}/10
- Treasury: ${scores.treasury}/10

A user is challenging your assessment. Your job:
1. FACT-CHECK their argument — do not accept it at face value. Evaluate if their claim is actually true.
2. If their argument is factually correct AND based on structural tokenomics data, acknowledge it.
3. If their argument is wrong, emotional, or based on price/sentiment, explain clearly why it doesn't change the score.
4. Be intellectually honest — if you missed something real, admit it.
5. NEVER adjust score based on: price performance, "community loves it", influencers, trading volume, or hopium.
6. ONLY adjust based on verifiable structural facts: supply mechanics, distribution %, vesting schedule, actual utility, value accrual mechanism, centralization risks.
7. Max score adjustment: ±1.5 from current score.

Respond in JSON format:
{
  "verdict": "confirmed" | "adjusted" | "partially",
  "newScore": <number, only if adjusted>,
  "reasoning": "<2-3 sentence explanation in Brazilian Portuguese — direct, no fluff>",
  "validPoints": ["<factual point accepted>"],
  "counterPoints": ["<claim rejected and why>"]
}

Keep reasoning concise. Be direct. Respond ONLY with valid JSON, no markdown, no code blocks.`;

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 600,
      temperature: 0.3,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Meu argumento para contestar a nota de ${currentScore}/10 do ${tokenSymbol}:\n\n${userArgument}`,
        },
      ],
    });

    const rawText = completion.choices[0]?.message?.content ?? '';

    // Parse JSON, stripping any accidental markdown wrappers
    const jsonText = rawText.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(jsonText);

    // Clamp newScore within ±1.5 of currentScore if present
    if (parsed.newScore !== undefined) {
      const min = Math.max(0, currentScore - 1.5);
      const max = Math.min(10, currentScore + 1.5);
      parsed.newScore = Math.min(max, Math.max(min, parsed.newScore));
      // If the change is negligible, treat as confirmed
      if (Math.abs(parsed.newScore - currentScore) < 0.2) {
        parsed.verdict = 'confirmed';
        delete parsed.newScore;
      }
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Reconsider API error:', err);
    return res.status(500).json({ error: 'AI analysis failed. Check OPENAI_API_KEY env var.' });
  }
}
