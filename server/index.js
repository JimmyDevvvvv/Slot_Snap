const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

let qrScanned = false;
let layout = [
    [0, 1, 0],
    [0, 0, 1],
    [1, 0, 0]
]

// QR validation route
app.post('/validate-qr', (req, res) => {
    const { qrValue } = req.body;

    if (qrValue === 'UNLOCK_MAP_A') {
        return res.json({
            success: true,
            message: 'QR valid',
            layout: [
                [0, 1, 0],
                [0, 0, 1],
                [1, 0, 0]
            ]
        });
    } else {
        return res.status(403).json({ success: false, message: 'Invalid QR code' });
    }
});




// When map.html is opened after scan
app.post('/notify-scanned', (req, res) => {
    qrScanned = true;
    res.json({ success: true });
});

// Main site checks if QR was scanned
app.get('/check-scan', (req, res) => {
    res.json({ scanned: qrScanned });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// GET layout
app.get('/get-layout', (req, res) => {
    res.json({ layout });
});

// Reserve a slot
app.post('/reserve', (req, res) => {
    const { row, col } = req.body;
    if (layout[row][col] === 0) {
        layout[row][col] = 2; // 2 = reserved
        return res.json({ success: true });
    }
    return res.status(400).json({ success: false, message: 'Spot already taken' });
});
