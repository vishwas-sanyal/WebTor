// module.exports = {
//     progress: 0,
//     status: "idle"
// };
let state = {
    progress: 0,
    status: "idle"
};
let filePath = null;
let socket = null;
// let stopped = false;
let flow = {
    paused: false,
    stopped: false,
}

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
    pause() {
        flow.paused = true;
        state.status = "paused";
        console.log("---Paused---");
    },
    resume() {
        flow.paused = false;
        state.status = "downloading";
        console.log("---Resumed---");
    },
    isPaused() {
        return flow.paused;
    },
    stop() {
        flow.stopped = true;
    },
    isStopped() {
        return flow.stopped;
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
