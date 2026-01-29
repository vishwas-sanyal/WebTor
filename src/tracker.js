'use strict';

const dgram = require('dgram');
const Buffer = require('buffer').Buffer;
const urlParse = require('url').parse;
const crypto = require('crypto');
const torrentParser = require('./torrent-parser');
const util = require('./util');

module.exports.getPeers = (torrent, callback) => {
    const socket = dgram.createSocket('udp4');
    const url = torrent.announce.toString('utf8');

    // const announceUrl = new URL(torrent.announce.toString('utf8'));
    // const announceUrl = new URL(getAnnounceUrl(torrent));

    // if (announceUrl.protocol !== 'udp:') {
    //     console.log('Tracker protocol:', announceUrl.protocol);
    //     throw new Error('Tracker is not UDP: ' + announceUrl.href);
    // }
    // console.log('Tracker protocol:', announceUrl.protocol);
    // const host = announceUrl.hostname;
    // const port = Number(announceUrl.port);

    // if (!port || Number.isNaN(port)) {
    //     throw new Error('Invalid UDP tracker port: ' + announceUrl.href);
    // }

    // 1. send connect request
    udpSend(socket, buildConnReq(), url);
    // udpSend(socket, buildConnReq(), host, port);

    socket.on('message', response => {
        if (respType(response) === 'connect') {
            // 2. receive and parse connect response
            const connResp = parseConnResp(response);
            // 3. send announce request
            const announceReq = buildAnnounceReq(connResp.connectionId, torrent);
            // udpSend(socket, announceReq, url);
            console.log('Sending connect to', url);
            udpSend(socket, announceReq, url);
        } else if (respType(response) === 'announce') {
            // let announceResp;
            // if (Buffer.isBuffer(response)) {
            //     announceResp = parseCompactPeers(response);
            //     callback(announceResp.peers);
            //     console.log('Peers from tracker:', announceResp.peers);
            // } else {
            //     announceResp = parseAnnounceResp(response);
            //     callback(announceResp.peers);
            //     console.log('Peers from tracker:', announceResp.peers);
            // }

            // 4. parse announce response
            const announceResp = parseAnnounceResp(response);
            console.log('Peers buffer length:', response.length - 20);
            // 5. pass peers to callback
            callback(announceResp.peers);
            console.log('Peers from tracker:', announceResp.peers);
        }
    });
};

function udpSend(socket, message, rawUrl, callback = () => { }) {
    const url = urlParse(rawUrl);
    socket.send(message, 0, message.length, url.port, url.hostname, callback);
    // socket.send(message, 0, message.length, host, port, callback);
}

// function getAnnounceUrl(torrent) {
//     if (torrent.announce) {
//         return torrent.announce.toString('utf8');
//     }

//     if (torrent['announce-list']) {
//         // announce-list is an array of arrays
//         return torrent['announce-list'][0][0].toString('utf8');
//     }

//     throw new Error('No announce URL found in torrent');
// }


function respType(resp) {
    const action = resp.readUInt32BE(0);
    if (action === 0) return 'connect';
    if (action === 1) return 'announce';
}

function buildConnReq() {
    const buf = Buffer.alloc(16);

    // connection id
    buf.writeUInt32BE(0x417, 0);
    buf.writeUInt32BE(0x27101980, 4);
    // action
    buf.writeUInt32BE(0, 8);
    // transaction id
    crypto.randomBytes(4).copy(buf, 12);

    return buf;
}

function parseConnResp(resp) {
    return {
        action: resp.readUInt32BE(0),
        transactionId: resp.readUInt32BE(4),
        connectionId: resp.slice(8)
    }
}

function buildAnnounceReq(connId, torrent, port = 6881) {
    const buf = Buffer.allocUnsafe(98);

    // connection id
    connId.copy(buf, 0);
    // action
    buf.writeUInt32BE(1, 8);  // announce
    // transaction id
    crypto.randomBytes(4).copy(buf, 12);
    // info hash
    torrentParser.infoHash(torrent).copy(buf, 16);
    // peerId
    util.genId().copy(buf, 36);
    // downloaded
    Buffer.alloc(8).copy(buf, 56);
    // left
    torrentParser.size(torrent).copy(buf, 64);
    // uploaded
    Buffer.alloc(8).copy(buf, 72);
    // event
    buf.writeUInt32BE(0, 80);
    // ip address
    buf.writeUInt32BE(0, 84);
    // key
    crypto.randomBytes(4).copy(buf, 88);
    // num want
    buf.writeInt32BE(-1, 92);
    // port
    buf.writeUInt16BE(port, 96);

    return buf;
}

function parseAnnounceResp(resp) {
    function group(iterable, groupSize) {
        let groups = [];
        for (let i = 0; i < iterable.length; i += groupSize) {
            groups.push(iterable.slice(i, i + groupSize));
        }
        return groups;
    }
    // const action = resp.readUInt32BE(0);
    // if (action !== 1) return null;

    // function parseCompactPeers(buffer) {
    //     const peers = [];

    //     for (let i = 0; i < buffer.length; i += 6) {
    //         peers.push({
    //             ip: `${buffer[i]}.${buffer[i + 1]}.${buffer[i + 2]}.${buffer[i + 3]}`,
    //             port: buffer.readUInt16BE(i + 4)
    //         });
    //     }

    //     return peers;
    // }
    // const peerBuf = resp.slice(20);

    // if (peerBuf.length % 6 !== 0) {
    //     console.warn('Invalid peer buffer size:', peerBuf.length);
    // }

    return {
        // action,
        action: resp.readUInt32BE(0),
        transactionId: resp.readUInt32BE(4),
        // interval: resp.readUInt32BE(8),
        leechers: resp.readUInt32BE(8),
        seeders: resp.readUInt32BE(12),
        // peers: parseCompactPeers(peerBuf)
        peers: group(resp.slice(20), 6).map(address => {
            return {
                ip: address.slice(0, 4).join('.'),
                port: address.readUInt16BE(4)
            }
        })
    }
}