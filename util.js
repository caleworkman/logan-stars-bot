function capitalize(s) {
    if (!s) return;
    return s.charAt(0).toUpperCase() + s.slice(1);
}

module.exports = {
    capitalize
};