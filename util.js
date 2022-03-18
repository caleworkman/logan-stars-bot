function capitalize(s) {
    if (!s) return;
    return s.charAt(0).toUpperCase() + s.slice(1);
}

// Make the supplied word plural (append "s") according to quantity
function pluralize(word, quantity) {
    if (quantity === 1) return word;
    return word + "s"; 
  }

module.exports = {
    capitalize,
    pluralize
};