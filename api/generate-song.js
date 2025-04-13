export default async function handler(req, res) {
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
        callBackUrl: "" // optional
    });

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "3808d0a3dea9b60176d99e6737a03ff1" // Replace this
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