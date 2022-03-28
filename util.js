function capitalize(s) {
    if (!s) return;
    return s.charAt(0).toUpperCase() + s.slice(1);
}

// Make the supplied word plural (append "s") according to quantity
function pluralize(word, quantity) {
    if (quantity === 1) return word;
    return word + "s"; 
}

// Return an emoji string of stars
function repeatStars(num) {

    if (!num || (num <= 0)) return "";

    const star = "\:star:";
    const star_10 = "\:star2:";
    const star_100 = "\:dizzy:";
    const star_1000 = "\:stars:";

    // % is NOT the modulo operator in javascript
    const n_1000 = Math.floor(num / 1000);
    var remainder = num % 1000;

    const n_100 = Math.floor(remainder / 100);
    remainder = remainder % 100;

    const n_10 = Math.floor(remainder / 10);
    remainder = remainder % 10;

    const starString = star_1000.repeat(n_1000) + star_100.repeat(n_100) + star_10.repeat(n_10) + star.repeat(remainder);

    if (starString.length > 1900) {
        // Max discord message limit is 2000 characters, left extra space for username and star count string
        return `Wow much ${star_1000} \:sunglasses:`;
    }
    return starString;
}

function makeUserString(username, numStars) {
    return `**${capitalize(username)}**: ${repeatStars(numStars)} (${numStars})`
}

module.exports = {
    capitalize,
    makeUserString,
    pluralize,
    repeatStars
};