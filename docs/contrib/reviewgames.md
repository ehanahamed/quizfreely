# Review Games

## The plan thingy

### the teachers perspective

a teacher goes to their dashboard and opens a study set, one that they downloaded or one they saved to their account. (already programmeded)

when they open the study set they have the option to do bla bla bla and the option to host a review game. (already programmeded)

when they get to the open screen with options, the json of the study set is saved to localstorage (already programmed)

when they select the option to host a review game, the button-link brings them to the `host` page (already programmed)

the `host` page will then let the teacher create a code or generate a random code (TODO)

then after the teacher chooses a code, the button
 - uses some supabase API thingy to create a new channel (TODO)
 - then
 - puts the studyset json (loaded from localstorage) into the channel (already programmed)
 - then
 - hides the first, "setup screen", div and shows a second, "joining screen" div (TODO)

the second, "joining screen", div has the code and url shown at the top of the screen, and a grid list of joined users on the bottom, and a start button (TODO)

after all the users join, the teacher uses the start button, the button
 - uses some supabase API thingy to send a "yall can start now" message/signal to the channel (TODO)
 - hides the second, "joining screen" div and shows a third, "scoreboard screen" div (TODO)

the third, "scoreboard screen", div has a end button and a grid list as a scoreboard (TODO)

...
