let percentage = 0;

module.exports = {
    set(value) {
        percentage = value;
    },
    get() {
        return percentage;
    }
};
