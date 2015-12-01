# Guac-a-Mole
*A punny play on the classic game*
![Title Screen](https://raw.githubusercontent.com/sfrieson/Guac-A-Mole/master/images/screenshots/title.png)

## Requirements
Make a 1- or 2-player, responsive, in-browser game, taking advantage of semantic markup available in HTML.  Using JS or jQuery for DOM manipulation, design and implement logic for winning, and visually display which player won.  Be sure to adhere to KISS and DRY principals.

## Inspiration
![Classic Whac-a-mole arcade game.](http://www.techexclusive.net/wp-content/uploads/2013/05/WHACK-A-MOLE.jpg)

This game is a simple one inspired by the classic Whack-a-Mole carnival game.  Excuse to pun but I'm proud of it.

## Game Description
The game is one where pieces pop up and it is your job to hit them before they go away.
The game is a is extendable up to as many players as you want.  I put 4 because the screen holds it better at the moment.

### Act I. Introduction
The is an intro phase where the play inputs their name or default names are given to them.  When Let's play is hit, JavaScript grabs all of the names and creates a variable from the Player constructor function for them.  This in turn launches the game

### Act II. The Game

The game then has three levels, and each player plays the level before everyone moves on to the next.  Each level, the pieces pop up more frequently and stay up for a shorter amount of time.

![](https://raw.githubusercontent.com/sfrieson/Guac-A-Mole/master/images/screenshots/game-play.png)

### Act III. Comparison
At the end of the game, each players score is shown.  They then get bonus points for their swinging accuracy (hits/total swings), and for game completion (total hits/possible hits)

## The Logic

The game has each player play the same level one after the other (player 1 on level 1 player 2 on level 1, player 1 on level 2,... ).  I tried to get all of the switching between players and between levels to happen with for loops but I realized that when playing one player, I was playing all three levels at the same time because the for loop happened so quickly disregarding the time it took to go through the level.  Because of this I had to make a loop of functions that works something like this:

```javascript
var player = ['Amy', 'Grant', 'Carly', 'Simon'];
var currentPlayer = 0;
var level = 1;

function nextPlayer () {
  //Switch to next player
  //but never go above the max number of players.
  currentPlayer = (currentPlayer + 1) % player.length;

  if (currentPlayer === 0) { //If we're back at the top of the list    
    return nextLevel();
  }
  play(); //Next player plays next round.
}

function nextLevel () {
  level++; //Change Levels
  if (level > 3) {
      return console.log("Game Done");
  }
  play(); //Start next level
}

function play () {
  // Code to play level goes here.
  console.log(player[currentPlayer] + " is playing level " + level);
  nextPlayer();
}

play(); //Start the Game flow
```
 ***

In my original tries the swing function was on the game, but that didn't make sense to me since swinging and hitting is something the player does, not the game.  It took a few tricks like passing the game's scope as an argument to the function, but the game is better organized in my mind because of it.  This could allow a player to have a special swing functionality like a different sound than other players.  Another use could be that maybe certain players could have a handicap of some sort.  The swing and hit functions would likely need to access these properties off of it's own object.

## Display
For many of the screen layouts, I originally created the display in static HTML/CSS mock-ups and then translated what I needed into JavaScript because all of the games screen is constantly changing, but the webpage never changes.  I later added images and tweaked my CSS and JS slightly to make them work with the new graphic designs.

Specifically for the CSS, I kept all of my stylesheets separate, so I could edit them in smaller chunks that made more sense to me.  To make sure my master css stayed up to date, I ran a script on my terminal to automate adding the changes for me.

`cat styles/pieces/* > styles/master.css`

Another thing surprised me was that when I started adding the GIGs to the game, it seemed like some were showing and some weren't.  I finally realized that all of the GIFs are perfectly in sync with eachother.  Doing some searching I learned that they were referencing the same exact instance of the file that was cached, and to fix this I had to add a random query string on the end of the filename.  (ex 'avocado.gif?random_string')  This was easy to do in my loop with Math.random.

## Interaction

There is surprisingly little interaction in this game between the user and the technologies as far as number of ways they interact, though one of the main ways was having a problem.

I noticed that the accuracy was surprisingly low, so I started logging each swing and hit of the player to count it myself.  I started realized that there were a lot of double hits.  I couldn't figure out why for a while, but then I figured that the click function was firing on mousedown and mouseup.  Changing this small thing made the accuracy impore drastically because the player was taking almost half the swings now.

***

I'm pretty proud of how I thought to make my game responsive.  I needed everything to scale but hold its aspect ratio all the way.  Percentage units weren't completely quite the way to go because a height percent is based on height and width is based on width.  I need height to be based on width or vice versa.  Then I remembered the view height and view width units.  If i have a box that is 50vh tall and 50vh wide, both of those measurements are percentages based on the same unit.  when the browser is resized in this instance, it only reacts if the browser gets shorter/longer and not at all when it gets narrower/wider.

## Future Improvements

Each level has specific data that is specific to each held inside an object.  These objects are all inside of one master array to reference each level by index.  This makes it easy to add another level if desired. Currently, the sizes of the cell pieces and grids are hard-coded into CSS.  There are three options 3x2 grid, 3x3 grid, and 4x3 grid.  For each level, JavaScript grabs which resolution grid should be displayed and applies it to class names to fill the game board, e.g. A grid with the class "grid-3x2" full of cells with the glass "cell-3x2".  

To avoid hard-coding those classes and allowing the level maps to actually be made dynamically, wouldn't be difficult.  You would need to know the maximum width and height the entire grid can be, the number of cells you'd like, and the number of rows you'd like. Ex:

```javascript
var max-width= 500, max-height= 200, columns= 4, rows= 4, grid= {}, cell {};
grid.width = max-width - (max-width % columns); //The width minus any remainder from number of columns needed.
grid.height = max-height - (max-height % rows);
cell.width = 100 / columns; //percentage-based
cell.height = 100 / rows;
```

***

I had two other improvements that I had partially working, but time forced me to scrap them for now.  They both were causing difficulties in loops.

The first would have the players score count up from zero to it's appropriate score, and the other would add in the bonus points one bonus section at a time per character.  These both would add more suspense in figuring out who won.  

I got each of these to work for one character, but because loops happen so quickly, I ran into some other problems as I tried with multiple players.

***

The game practically doesn't work at all on mobile.  Maybe there is on touch event?

Also with the cursor sometime the divs get highlighted as if they were text.  There is likely a way to stop this from happening.

## Thank You

Thank you to my professors for hints along the way, my classmates for being helpful to bounce ideas off of and think through problems, and to my alpha and beta testers.
