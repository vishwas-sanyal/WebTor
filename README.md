# WebTor (Web UI + Local Server)

A BitTorrent client with a modern web UI, built to understand how torrents actually work under the hood - downloads files by communicating directly with peers using the BitTorrent protocol.

Supports torrent file parsing, tracker communication, piece-based downloading, and real-time progress tracking.

Note: Currently supports UDP trackers only.
### ⚠️ Important:
Due to torrent networking limitations on free cloud platforms, the backend must be run locally.
The frontend is hosted on Vercel and connects to your local server.

---

## ✨ Features

- 📥 Download .torrent files
- 🔗 Connects to trackers & peers
- 🧩 Piece-by-piece downloading
- ⏸ Pause / ▶ Resume
- 📊 Live progress tracking
- 🖥 Web UI (React)
- ⚙️ Backend in Node.js (no libraries for torrent logic)

---

## 🛠 Requirements

Backend (Local Machine)
- Node.js
- npm
- Stable internet connection
- OS: Windows / Linux / macOS

Frontend
- Any modern browser
- No setup needed (hosted on Vercel)

---

## 🎥 Installation Video:

---

## 🚀 Installation & Usage

### 1️⃣ Clone the Repository
```git clone https://github.com/vishwas-sanyal/WebTor.git```

### 2️⃣ Install Backend Dependencies
```cd server \n npm install```

### 3️⃣ Start the Backend Server
```node index.js```
- By default, the server runs on:
```http://localhost:3000```
⚠️ Keep this terminal running while downloading

## ⭐ Support

If this project helped you:

⭐ Star the repository

🎥 Watch the installation video

💬 Share feedback