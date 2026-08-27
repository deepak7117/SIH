import express from 'express';
import https from 'https';

const router = express.Router();

// Helper to fetch audio buffer for a single small text chunk (< 180 chars)
const fetchChunkAudio = (chunk, lang) => {
  return new Promise((resolve, reject) => {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      chunk
    )}&tl=${encodeURIComponent(lang)}&client=tw-ob`;

    const request = https.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Referer: 'https://translate.google.com/',
        },
      },
      (res) => {
        if (res.statusCode !== 200) {
          return reject(new Error(`Google TTS responded with status: ${res.statusCode}`));
        }
        const data = [];
        res.on('data', (chunkBuffer) => data.push(chunkBuffer));
        res.on('end', () => resolve(Buffer.concat(data)));
      }
    );

    request.on('error', reject);
  });
};

// In-memory cache for synthesized audio tracks
const audioCache = new Map();

// Helper handler for both GET and POST requests
const handleTtsRequest = async (req, res) => {
  const text = req.method === 'POST' ? req.body?.text : req.query?.text;
  const lang = (req.method === 'POST' ? req.body?.lang : req.query?.lang) || 'en';

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'Text parameter is required' });
  }

  // Cache key based on lang + text
  const cacheKey = `${lang}:${text.slice(0, 300)}`;
  if (audioCache.has(cacheKey)) {
    const cachedBuffer = audioCache.get(cacheKey);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', cachedBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.end(cachedBuffer);
  }

  try {
    const cleanText = text.replace(/\s+/g, ' ').trim();

    // Split long descriptions into sentences under 160 characters
    const sentences = cleanText.split(/(?<=[.!?।॥\n\r])\s+/).filter((s) => s.trim().length > 0);
    const chunks = [];
    let cur = '';

    for (const s of sentences) {
      if ((cur + ' ' + s).length < 160) {
        cur += (cur ? ' ' : '') + s;
      } else {
        if (cur.trim()) chunks.push(cur.trim());
        // If single sentence itself is longer than 160, slice into smaller phrases
        if (s.length > 160) {
          const parts = s.match(/.{1,150}(\s|$)/g) || [s];
          parts.forEach((p) => {
            if (p.trim()) chunks.push(p.trim());
          });
          cur = '';
        } else {
          cur = s;
        }
      }
    }
    if (cur.trim()) chunks.push(cur.trim());
    if (chunks.length === 0) chunks.push(cleanText.slice(0, 160));

    // Limit to top 20 chunks for fast response (< 1.5s total)
    const selectedChunks = chunks.slice(0, 20);

    // Fetch all chunk audio streams concurrently
    const audioBuffers = await Promise.all(
      selectedChunks.map((chunk) => fetchChunkAudio(chunk, lang))
    );

    // Combine all MP3 buffers into a single seamless continuous audio track
    const fullAudioBuffer = Buffer.concat(audioBuffers);

    // Store in cache (limit cache size to 100 items)
    if (audioCache.size > 100) {
      const firstKey = audioCache.keys().next().value;
      audioCache.delete(firstKey);
    }
    audioCache.set(cacheKey, fullAudioBuffer);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', fullAudioBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.end(fullAudioBuffer);
  } catch (err) {
    console.error('TTS Audio Generation Error:', err.message);
    res.status(500).json({ error: 'Failed to synthesize complete audio' });
  }
};

router.get('/', handleTtsRequest);
router.post('/', handleTtsRequest);

export default router;
