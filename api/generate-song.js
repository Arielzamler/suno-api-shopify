export default async function handler(req, res) {
    console.log('Vercel function triggered!');

    if (req.method === 'OPTIONS') {
        console.log('Handling OPTIONS request...');
        try {
            res.setHeader('Access-Control-Allow-Origin', '*'); // Keep '*' for broad testing
            res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.status(200).end();
            console.log('OPTIONS headers set and response sent.');
        } catch (error) {
            console.error('Error setting OPTIONS headers:', error);
            res.status(500).end(); // Send an error response
        }
        return;
    }

    if (req.method === 'POST') {
        console.log('Handling POST request...');
        const { name, age, hobbies, job } = req.body;
        const prompt = `A cheerful birthday song for ${name}, who just turned ${age}. They love ${hobbies} and work as a ${job}.`;
        const apiKey = process.env.SUNO_API_KEY;

        if (!apiKey) {
            console.error('SUNO_API_KEY environment variable not set.');
            res.status(500).json({ error: 'Server configuration error: API key not found.' });
            return;
        }

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${apiKey}`
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
                console.error('AI song generation failed:', data);
                res.status(500).json({ error: "Song generation failed", details: data });
                return;
            }

            res.status(200).json({ song_url: data.result.url });

        } catch (error) {
            console.error('Error during AI song generation request:', error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: `Method "${req.method}" not allowed.` });
    }
}