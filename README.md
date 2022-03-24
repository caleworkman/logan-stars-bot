# logan-stars-bot
Discord bot

`npm run dev`

## Commands for anyone

- `!stars` displays your star count.
- `!stars name` displays *name*'s star count.


## Commands for special users

- `!stars give name X` gives *X* stars to player *name*.
- `!stars take name X` removes *X* stars from player *name*
- `!stars set name X` sets a player's star count to *X*.

*X* is optional and defaults to 1.

## Leaderboards

- `!stars leaderboard N` displays the *N* players with the highest star count.
- `!stars loserboard N` displays the *N* players with the lowest star count.

*N* is optional and default to 5.


## Todo

- Allow delete user
- Use serverid to partition user's.
