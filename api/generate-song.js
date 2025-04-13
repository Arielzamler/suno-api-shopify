export default async function handler(req, res) {
    // Proper CORS setup
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle browser preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Only POST requests allowed' });
        return;
    }

    const { name, age, hobbies, job } = req.body;

    const prompt = `A cheerful birthday song for ${name}, who just turned ${age}. They love ${hobbies} and work as a ${job}.`;

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${apiKey}` // Replace with your key
        },
        body: JSON.stringify({
            prompt: prompt,
            style: "Happy Pop",
            title: `Birthday Song for ${name}`,
            customMode: true,
            instrumental: false,
            model: "V3_5",
            negativeTags: "Heavy Metal, Sad"
        })
    };

    try {
        const response = await fetch("https://apibox.erweima.ai/api/v1/generate", requestOptions);
        const data = await response.json();

        if (!data.result || !data.result.url) {
            res.status(500).json({ error: "Song generation failed", details: data });
            return;
        }

        res.status(200).json({ song_url: data.result.url });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}