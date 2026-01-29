// 'use strict'

// const download = require('./src/download');
// const torrentParser = require('./src/torrent-parser');

// const torrent = torrentParser.open(process.argv[2]);

// download(torrent, torrent.info.name);
// console.log('Starting torrent client...');

'use strict';

const download = require('./src/download');
const torrentParser = require('./src/torrent-parser');

function runTorrent(torrentPath) {
    const torrent = torrentParser.open(torrentPath);
    download(torrent, torrent.info.name);
    console.log('Starting torrent client...');
}

if (require.main === module) {
    // CLI usage
    runTorrent(process.argv[2]);
}

module.exports = runTorrent;
