const torrentState = require('./torrentState.js');
const path = require("path");

function stopTorrent() {
    console.log("🛑 Torrent stopped");
    torrentState.stop();
    torrentState.setStatus("stopped");

    const socket = torrentState.setSocket();
    if (socket && !socket.destroyed) {
        socket.end();
        socket.destroy();
    }
    torrentState.clearSocket();
}

const fs = require("fs");

function cleanupFiles() {

    // fs.rmSync("./../torrents", { recursive: true, force: true });
    // fs.rmSync(path.join(__dirname, "torrents"), { recursive: true, force: true });

    // const filePath = torrentState.getFilePath();

    // if (!filePath) return;

    // try {
    //     if (fs.existsSync(filePath)) {
    //         fs.unlinkSync(filePath);
    //         console.log("🧹 Torrent file removed:", filePath);
    //     }
    // } catch (err) {
    //     console.error("Cleanup failed:", err);
    // }

    // torrentState.reset();
    const filePath = torrentState.getFilePath();

    if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("🧹 Deleted:", filePath);
    }

    // fs.rmSync(path.join(__dirname, "./../torrents"), {
    //     recursive: true,
    //     force: true
    // });

    const files = fs.readdirSync(path.join(__dirname, "./../torrents"));

    for (const file of files) {
        const fullPath = path.join(path.join(__dirname, "./../torrents"), file);
        fs.rmSync(fullPath, { recursive: true, force: true });
    }
    console.log("🧹 torrents directory cleaned");

    torrentState.reset();
}

module.exports = { cleanupFiles, stopTorrent };