const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta segura para validar contraseñas
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    
    if (password === process.env.ADMIN_PASSWORD) {
        return res.json({ success: true, role: 'admin' });
    }
    if (password === process.env.SUPERADMIN_PASSWORD) {
        return res.json({ success: true, role: 'superadmin' });
    }
    
    res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
});

// Ruta segura para enviar mensajes a Telegram
app.post('/api/send-telegram', async (req, res) => {
    const { text } = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || botToken.includes("TU_TOKEN")) {
        return res.json({ success: false, message: "Telegram no configurado" });
    }

    try {
        const encodedText = encodeURIComponent(text);
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodedText}`);
        res.json({ success: true });
    } catch (error) {
        console.error("Error Telegram:", error);
        res.status(500).json({ success: false });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor Lili Market corriendo en el puerto ${PORT}`);
});
