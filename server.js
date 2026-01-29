// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const cors = require('cors');

// const runTorrent = require('./index');

// const app = express();
// app.use(cors());

// const upload = multer({
//     dest: path.join(__dirname, 'torrents')
// });

// app.post('/upload', upload.single('torrent'), (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ error: 'No torrent received' });
//     }

//     console.log('Torrent uploaded:', req.file.originalname);

//     // 🔥 THIS is the key line
//     runTorrent(req.file.path);

//     res.json({
//         message: 'Torrent accepted',
//         name: req.file.originalname
//     });
// });

// // app.get('/progress', (req, res) => {
// //     res.set({
// //         'Content-Type': 'text/event-stream',
// //         'Cache-Control': 'no-cache',
// //         'Connection': 'keep-alive'
// //     });

// //     const timer = setInterval(() => {
// //         res.write(`data: ${progress.get()}\n\n`);
// //     }, 500);

// //     req.on('close', () => clearInterval(timer));
// // });
// const progress = require('./src/progress');

// app.get('/progress', (req, res) => {
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');

//     const interval = setInterval(() => {
//         res.write(`data: ${progress.get()}\n\n`);
//     }, 500);

//     req.on('close', () => {
//         clearInterval(interval);
//     });
// });


// app.listen(3000, () => {
//     console.log('Server running on http://localhost:3000');
// });
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const torrentState = require('./src/torrentState.js');

const runTorrent = require('./index');
const percentage = require('./src/progress');

const app = express();
// app.use(cors());
// app.use(cors({
//     origin: "http://localhost:3000", // or 5173 if Vite
//     credentials: true
// }));
app.use(cors({
    origin: "http://localhost:5173", // your React app
    methods: ["GET", "POST"],
    credentials: true
}));


// 🔥 Create HTTP server
const server = http.createServer(app);

// 🔥 Attach Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

// 🔥 Stream console logs to frontend
const originalLog = console.log;
console.log = (...args) => {
    const message = args.join(' ');
    originalLog(message);
    io.emit('log', message);
};

// Optional: also stream errors
const originalError = console.error;
console.error = (...args) => {
    const message = args.join(' ');
    originalError(message);
    io.emit('error', message);
};

io.on('connection', (socket) => {
    console.log('Client connected');
});

const upload = multer({
    dest: path.join(__dirname, 'torrents')
});

app.post('/upload', upload.single('torrent'), (req, res) => {
    if (!req.file) {
        console.error('No torrent received');
        return res.status(400).json({ error: 'No torrent received' });
    }

    console.log('Torrent uploaded:', req.file.originalname);

    runTorrent(req.file.path);

    res.json({
        message: 'Torrent accepted',
        name: req.file.originalname
    });
});

// export default torrentState = {
//     progress: 0,
//     status: "idle" // idle | handshaking | downloading | paused | stopped
// };

// app.get('/progress', (req, res) => {
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');

//     const interval = setInterval(() => {
//         res.write(`data: ${progress.get()}\n\n`);
//     }, 500);

//     req.on('close', () => {
//         clearInterval(interval);
//     });
// });
app.get("/progress", (req, res) => {
    console.log("🟢 Client connected to /progress");

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const interval = setInterval(() => {
        // console.log("📡 Sending:", torrentState);

        // res.write(`data: ${percentage.get()}\n\n`);

        // res.write(`data: ${JSON.stringify(torrentState)}\n\n`);

        // res.write(`data: ${JSON.stringify({
        //     progress: torrentState.progress,
        //     status: torrentState.status
        // })}\n\n`);

        // const state = torrentState.get();
        res.write(`data: ${JSON.stringify(torrentState.get())}\n\n`);
    }, 1000);

    req.on("close", () => {
        console.log("🔴 Client disconnected");
        clearInterval(interval);
    });
});


server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
    // console.log(`-------------------------------${torrentState.get().progress}`);
});
