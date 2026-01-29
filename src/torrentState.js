// module.exports = {
//     progress: 0,
//     status: "idle"
// };
let state = {
    progress: 0,
    status: "idle"
};

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
    }
};
