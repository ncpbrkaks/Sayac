export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Sadece POST' });

    const { name, count } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ error: 'API anahtarı eksik' });

    const time = new Date().toLocaleTimeString('tr-TR', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit' });

    const prompt = `Sen acımasız, karanlık mizah yapan, +18 absürt komedi sınırlarında dolaşan bir yapay zeka koçusun. Asla sağlıklı yaşam tavsiyesi verme, asla merhamet gösterme.
    Kullanıcı Adı: ${name}
    Bugün içtiği zararlı madde sayısı: ${count}
    Şu anki saat: ${time}
    Görev: Bu kullanıcıya saati ve mevcut sayısını (skorunu) kullanarak tek cümlelik, aşırı yaratıcı, aşağılayıcı ve çok komik bir laf sok. Konuşma dili doğal ve iğneleyici olsun.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        const quote = data.candidates[0].content.parts[0].text.trim().replace(/^["']|["']$/g, '');
        res.status(200).json({ quote });
    } catch (error) {
        res.status(500).json({ quote: "Yapay zeka bile senin bu haline laf bulamadı..." });
    }
}
