const express = require('express');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API: Generate Unique QR Code per User & per Alarm
app.post('/api/generate-qr', async (req, res) => {
    try {
        const { userId, label, time } = req.body;
        const alarmId = uuidv4();
        const uniqueToken = `CHRONOQR|USER:${userId || 'GUEST'}|ALARM:${alarmId}|TIME:${time}`;

        const qrImage = await QRCode.toDataURL(uniqueToken, {
            width: 360,
            margin: 2,
            color: {
                dark: '#090d16',
                light: '#ffffff'
            }
        });

        res.json({
            success: true,
            alarmId,
            label: label || 'Wake Up Alarm',
            time,
            token: uniqueToken,
            qrImage
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'QR Generation Error' });
    }
});

// Safe Catch-All Middleware for Express v5 (Avoids path-to-regexp errors)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Dynamic Port for Localhost & Live Hosting
 // Dynamic Port for Localhost & Live Hosting
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 ChronoQR 3D Suite running at: http://localhost:${PORT}`);
  });
}

module.exports = app;