function parseArgs(argArray) {
    // Return a json object for the command and any parameters
    // The '!stars' command will already be removed from argArray

    const args = argArray.map(x => x.toLowerCase());

    // First is always a command, if it's not a command then it's a username
    const command = args[0];

    if (["give", "take", "set"].includes(command)) {
        // These have the form <action> <username> <quantity (optional)>
        return {
            command: command,
            username: args[1],
            quantity: args[2] ?? 1
        }

    } else if (["leaderboard", "loserboard"].includes(command)) {
        // numUsers is optional, defaults to 5
        return { 
            command: command, 
            numUsers: args[1] ?? 5,
            isLoserboard: command === "loserboard"
        }

    } else {
        // One argument is assumed to be a name
        return { 
            command: "query", 
            username: command 
        };
    }

}

module.exports = {
    parseArgs
}