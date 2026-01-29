'use strict';

const fs = require('fs');
const Queue = require('./queue');
// const queue = new Queue(torrent);
const net = require('net');
const tracker = require('./tracker');
const message = require('./message');
const Pieces = require('./pieces.js');
// const server = require('./../server.js');
const torrentState = require('./torrentState.js');

module.exports = (torrent, path) => {
    // const requested = [];
    tracker.getPeers(torrent, peers => {
        // const pieces = new Pieces(torrent.info.pieces.length / 20);
        const pieces = new Pieces(torrent);
        const file = fs.openSync(path, 'w');
        peers.forEach(peer => download(peer, torrent, pieces, file));
    });
};

function download(peer, torrent, peices, file) {
    const socket = new net.Socket();
    console.log('Connecting to peer:', peer.ip, peer.port);
    socket.on('error', console.log);
    socket.connect(peer.port, peer.ip, () => {
        console.log('Connected to peer:', peer.ip);
        socket.write(message.buildHandshake(torrent));
    });
    const queue = new Queue(torrent);
    onWholeMsg(socket, msg => msgHandler(msg, socket, peices, queue, torrent, file));
}

function onWholeMsg(socket, callback) {
    let savedBuf = Buffer.alloc(0);
    let handshake = true;

    socket.on('data', recvBuf => {
        // msgLen calculates the length of a whole message
        const msgLen = () => handshake ? savedBuf.readUInt8(0) + 49 : savedBuf.readInt32BE(0) + 4;
        savedBuf = Buffer.concat([savedBuf, recvBuf]);

        while (savedBuf.length >= 4 && savedBuf.length >= msgLen()) {
            callback(savedBuf.slice(0, msgLen()));
            savedBuf = savedBuf.slice(msgLen());
            handshake = false;
        }
    });
}

// 2
function msgHandler(msg, socket, pieces, queue, torrent, file) {
    if (isHandshake(msg)) {
        console.log('Handshake received');

        // torrentState = { progress: 0, status: "handshaking" };
        // torrentState.progress = 0;
        // torrentState.status = "handshaking";
        torrentState.setStatus("handshaking");
        // torrentState.setProgress(0);

        socket.write(message.buildInterested());
    } else {
        const m = message.parse(msg);

        if (m.id === 0) chokeHandler(socket);
        if (m.id === 1) unchokeHandler(socket, pieces, queue);
        if (m.id === 4) haveHandler(m.payload, socket, pieces, queue);
        if (m.id === 5) bitfieldHandler(socket, pieces, queue, m.payload);
        if (m.id === 7) pieceHandler(socket, pieces, queue, torrent, file, m.payload);
    }
}

function isHandshake(msg) {
    return msg.length === msg.readUInt8(0) + 49 &&
        msg.toString('utf8', 1, 20) === 'BitTorrent protocol';
}

function chokeHandler(socket) {
    socket.end();
}

function unchokeHandler(socket, pieces, queue) {
    queue.choked = false;
    console.log('Peer unchoked us');
    requestPiece(socket, pieces, queue);
}

function haveHandler(payload, socket, pieces, queue) {
    //...
    const pieceIndex = payload.readUInt32BE(0);
    const queueEmpty = queue.length === 0;

    console.log('QUEUE VALUE:', queue);
    console.log('QUEUE TYPE:', typeof queue);
    console.log('QUEUE KEYS:', Object.getOwnPropertyNames(Object.getPrototypeOf(queue)));


    queue.addPiece(pieceIndex);

    if (queueEmpty) requestPiece(socket, pieces, queue);
}

function bitfieldHandler(socket, pieces, queue, payload) {
    const queueEmpty = queue.length === 0;
    payload.forEach((byte, i) => {
        for (let j = 0; j < 8; j++) {

            if (byte % 2) queue.addPiece(i * 8 + 7 - j);

            byte = Math.floor(byte / 2);
        }
    });
    if (queueEmpty) requestPiece(socket, pieces, queue);
}

function pieceHandler(socket, pieces, queue, torrent, file, pieceResp) {
    // console.log(pieceResp);
    pieces.addReceived(pieceResp);
    pieces.printPercentDone();

    // torrentState = { progress: 0, status: "downloading" };
    // torrentState.progress = 0;
    // torrentState.status = "downloading";
    torrentState.setStatus("downloading");
    // torrentState.setProgress(0);

    console.log('Received block:', pieceResp.index, pieceResp.begin);
    const offset = pieceResp.index * torrent.info['piece length'] + pieceResp.begin;
    fs.write(file, pieceResp.block, 0, pieceResp.block.length, offset, () => { });
    console.log('Written to file at offset:', offset);

    if (pieces.isDone()) {
        console.log('DONE!');
        torrentState.setProgress(100);
        socket.end();
        try { fs.closeSync(file); } catch (e) { }
    } else {
        requestPiece(socket, pieces, queue);
    }
}

function requestPiece(socket, pieces, queue) {
    if (queue.choked) return null;

    while (queue.length()) {
        const pieceBlock = queue.deque();
        if (pieces.needed(pieceBlock)) {
            console.log('Requesting block:', JSON.stringify(pieceBlock));
            socket.write(message.buildRequest(pieceBlock));
            pieces.addRequested(pieceBlock);
            break;
        }
    }
}