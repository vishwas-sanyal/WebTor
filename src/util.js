'use strict';

// import { randomBytes } from 'crypto';
const crypto = require('crypto');

let id = null;

module.exports.genId = () => {
    if (!id) {
        id = crypto.randomBytes(20);
        Buffer.from('-VS0001-').copy(id, 0);
    }
    return id;
}