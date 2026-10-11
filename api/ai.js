export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Sadece POST' });

    const { name, count } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(200).json({ quote: 'HATA: Vercel ortam değişkenlerinde şifre eksik!' });
    }

    const time = new Date().toLocaleTimeString('tr-TR', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit' });

    const prompt = `Sen acımasız, karanlık mizah yapan, aşırı sarkastik bir yapay zeka koçusun. Asla sağlıklı yaşam tavsiyesi verme.
    Kullanıcı Adı: ${name}
    Bugün içtiği zararlı madde sayısı: ${count}
    Şu anki saat: ${time}
    Görev: Bu kullanıcıya saati ve mevcut sayısını kullanarak tek cümlelik, yaratıcı ve iğneleyici bir laf sok. Çok ağır eleştir ama aşırı sansüre takılacak kelimeler kullanma.`;

    try {
        // Hata veren "gemini-1.5-flash" yerine, garanti çalışan "gemini-pro" modeline geçtik
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                ]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return res.status(200).json({ quote: "Google API Hatası: " + data.error.message });
        }

        if (!data.candidates || data.candidates.length === 0) {
            return res.status(200).json({ quote: "Google Sansürüne Takıldı! Şaka fazla ağırdı." });
        }

        const quote = data.candidates[0].content.parts[0].text.trim().replace(/^["']|["']$/g, '');
        res.status(200).json({ quote });
        
    } catch (error) {
        res.status(200).json({ quote: "Sistem Hatası: " + error.message });
    }
}
