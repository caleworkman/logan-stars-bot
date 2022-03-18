function parseArgs(argArray) {
    // Return a json object for the command and any parameters
    // The '!loganstars' command will already be removed from argArray

    const args = argArray.map(x => x.toLowerCase());

    if (args.length === 1) {
        // One argument is assumed to be a name if it is not a valid command
        const arg = args[0];

        if (arg === "leaderboard") {
            return { command: "leaderboard" };
        } else {
            return { command: "query", username: arg };
        }
  
    } else {
        // These have the form <action> <username> <quantity (optional)>
        const command = args[0];
        if (["give", "take", "set"].includes(command)) {
            return {
                command: command,
                username: args[1],
                quantity: args[2] ?? 1
            }
        }
    }

}

module.exports = {
    parseArgs
}