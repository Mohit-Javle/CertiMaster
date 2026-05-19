const express = require('express');
const router = express.Router();

// @route   GET /api/ai/generate
// @desc    Server-side proxy for Pollinations AI image generation to avoid browser Referer rate-limiting blocks
router.get('/generate', async (req, res) => {
    const { prompt, seed, width, height } = req.query;
    
    if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required' });
    }

    const targetWidth = width || 1056;
    const targetHeight = height || 816;
    const targetSeed = seed || Math.floor(Math.random() * 100000);

    const refinedPrompt = `${prompt}, high-resolution elegant award certificate background template, empty blank central space, premium graphic design frame, beautiful margins, 4k quality, no text, no watermark, no words`;

    const pollinationsUrl = `https://image.pollinations.ai/p/${encodeURIComponent(refinedPrompt)}?width=${targetWidth}&height=${targetHeight}&nologo=true&seed=${targetSeed}`;

    try {
        console.log(`[AI Proxy] Fetching from Pollinations: ${pollinationsUrl}`);
        
        // Fetch server-side without Referer/Origin headers from client
        const response = await fetch(pollinationsUrl, {
            headers: {
                // Ensure a generic server-side agent header
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            console.error(`[AI Proxy] Upstream returned status: ${response.status}`);
            return res.status(response.status).send('Failed to generate image from upstream');
        }

        // Get arrayBuffer and send as buffer
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24h
        res.send(buffer);

    } catch (err) {
        console.error('[AI Proxy] Error fetching from Pollinations:', err.message);
        res.status(500).send('Internal Server Error in AI Proxy');
    }
});

module.exports = router;
