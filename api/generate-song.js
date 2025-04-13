export default async function handler(req, res) {
    console.log('Vercel function triggered!');

    if (req.method === 'OPTIONS') {
        console.log('Handling OPTIONS request...');
        res.setHeader('Access-Control-Allow-Origin', '*'); // Keep '*' for now for testing
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.status(200).end();
        console.log('OPTIONS headers set and response sent.');
        return;
    }

    if (req.method === 'POST') {
        console.log('Handling POST request...');
        const { name, age, hobbies, job } = req.body;
        const prompt = `A cheerful birthday song for ${name}, who just turned ${age}. They love ${hobbies} and work as a ${job}.`;

        // Access your API key from environment variables (recommended)
        const apiKey = process.env.SUNO_API_KEY; // Make sure you've set this in Vercel

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${apiKey}` // Use the API key here
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
}