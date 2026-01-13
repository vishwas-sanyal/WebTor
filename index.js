'use strict'
// import { readFileSync } from 'fs';
// import bencode from 'bencode';
// import tracker from './src/tracker.js';
import torrentParser from './src/torrent-parser.js';
import download from './src/download.js';

// import dgram from 'dgram';
// import { Buffer } from 'node:buffer';
// import { URL } from 'url';

// const torrent = bencode.decode(readFileSync('puppy.torrent'));
// console.log(torrent.announce.toString('utf8'));

const torrent = torrentParser.open('puppy.torrent');

download(torrent);
// tracker.getPeers = (torrent, peers) => {
//     console.log('list of peers: ', peers);
// };