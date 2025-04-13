export default async function handler(req, res) {
    // Add CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*"); // You can use Shopify's domain here instead of '*'
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle CORS preflight request
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST requests allowed' });
    }

    const { name, age, hobbies, job } = req.body;

    const prompt = `A cheerful birthday song for ${name}, who just turned ${age}. They love ${hobbies} and work as a ${job}.`;

    const raw = JSON.stringify({
        prompt: prompt,
        style: "Happy Pop",
        title: `Birthday Song for ${name}`,
        customMode: true,
        instrumental: false,
        model: "V3_5",
        negativeTags: "Heavy Metal, Sad",
        callBackUrl: ""
    });

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer 3808d0a3dea9b60176d99e6737a03ff1"
        },
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch("https://apibox.erweima.ai/api/v1/generate", requestOptions);
        const data = await response.json();

        if (!data.result || !data.result.url) {
            return res.status(500).json({ error: "Song generation failed", details: data });
        }

        return res.status(200).json({ song_url: data.result.url });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}