// module.exports = {
//     progress: 0,
//     status: "idle"
// };
let state = {
    progress: 0,
    status: "idle"
};
let filePath = null;
let stopped = false;
let socket = null;

module.exports = {
    setProgress(value) {
        state.progress = value;
    },

    setStatus(value) {
        state.status = value;
    },

    get() {
        return state;
    },

    reset() {
        state.progress = 0;
        state.status = "idle";
    },
    //////////////////////////////////
    setFilePath(path) {
        filePath = path;
    },
    getFilePath() {
        return filePath;
    },
    //////////////////////////////////
    stop() {
        stopped = true;
    },
    resume() {
        stopped = false;
    },
    isStopped() {
        return stopped;
    },
    //////////////////////////////////
    setSocket(s) {
        socket = s;
    },

    getSocket() {
        return socket;
    },

    clearSocket() {
        socket = null;
    }
};
