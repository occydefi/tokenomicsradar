/**
 * /api/reconsider
 * AI-powered score reconsideration endpoint.
 * User presents an argument → Claude evaluates against the tokenomics data.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
    return res.status(400).json({ error: 'Argument too short' });
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
1. Evaluate if their argument raises VALID points you may have missed or underweighted
2. Be intellectually honest — if they're right, admit it
3. If the argument is valid, suggest an adjusted score (max ±1.5 from current)
4. If not valid, explain why your original assessment stands
5. Never adjust score based on price performance, sentiment, or "the community loves it" arguments
6. ONLY adjust based on structural tokenomics facts: supply mechanics, distribution, vesting, utility, value accrual

Respond in JSON format:
{
  "verdict": "confirmed" | "adjusted" | "partially",
  "newScore": <number, only if adjusted>,
  "reasoning": "<2-3 sentence explanation in Brazilian Portuguese>",
  "validPoints": ["<point 1>", "<point 2>"],
  "counterPoints": ["<point 1>", "<point 2>"]
}

Keep reasoning concise. Be direct. No financial advice framing needed — this is educational.
Respond ONLY with valid JSON, no markdown, no code blocks.`;

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 600,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Meu argumento para contestar a nota de ${currentScore}/10 do ${tokenSymbol}:\n\n${userArgument}`,
        },
      ],
    });

    const rawText = message.content
      .filter(b => b.type === 'text')
      .map(b => (b as { type: 'text'; text: string }).text)
      .join('');

    // Parse JSON, stripping any accidental markdown wrappers
    const jsonText = rawText.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(jsonText);

    // Clamp newScore within ±1.5 of currentScore if present
    if (parsed.newScore !== undefined) {
      const min = Math.max(0, currentScore - 1.5);
      const max = Math.min(10, currentScore + 1.5);
      parsed.newScore = Math.min(max, Math.max(min, parsed.newScore));
      // If the newScore is essentially the same, treat as confirmed
      if (Math.abs(parsed.newScore - currentScore) < 0.2) {
        parsed.verdict = 'confirmed';
        delete parsed.newScore;
      }
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Reconsider API error:', err);
    return res.status(500).json({ error: 'AI analysis failed' });
  }
}
