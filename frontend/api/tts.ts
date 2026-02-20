import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text, voice = 'nova' } = req.body as { text: string; voice?: string };
  if (!text || text.length > 4096) return res.status(400).json({ error: 'Invalid text' });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('❌ TTS: No OPENAI_API_KEY in env');
    return res.status(500).json({ error: 'No API key configured' });
  }
  console.log('✅ TTS: API key present, length:', apiKey.length);

  try {
    // 30s timeout to prevent infinite loading
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    console.log('🎤 TTS: Calling OpenAI with text length:', text.length);
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice, // nova, shimmer, alloy, echo, fable, onyx
        response_format: 'mp3',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('📡 TTS: OpenAI response status:', response.status);
    if (!response.ok) {
      const err = await response.text();
      console.error('❌ OpenAI TTS error:', response.status, err.substring(0, 200));
      return res.status(500).json({ error: 'TTS generation failed', details: err.substring(0, 100) });
    }

    const audioBuffer = await response.arrayBuffer();
    console.log('✅ TTS: Audio generated, size:', audioBuffer.byteLength, 'bytes');
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.status(200).send(Buffer.from(audioBuffer));
  } catch (error: any) {
    console.error('TTS error:', error.message);
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'TTS generation timeout' });
    }
    return res.status(500).json({ error: 'TTS generation failed' });
  }
}
