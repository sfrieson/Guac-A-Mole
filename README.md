# Guac-a-Mole
*A punny play on the classic game*

## Requirements
Make a 1- or 2-player, responsive, in-browser game, taking advantage of semantic markup available in HTML.  Using JS or jQuery for DOM manipulation, design and implement logic for winning, and visually display which player won.  Be sure to adhere to KISS and DRY principals.

## Inspiration
![Classic Whac-a-mole arcade game.](http://www.techexclusive.net/wp-content/uploads/2013/05/WHACK-A-MOLE.jpg)

## Game Description

### Act I. Introduction

### Act II. The Game

### Act III. Comparison

## The Logic

## Display


## Future Improvements

## Thank You

For the readme:
"explanations of the technologies used, the approach taken, installation instructions, unsolved problems, etc."

Notes:
- For loop level problem and solution of function as loop
- Round loop

```javascript
var player = ['Amy', 'Grant', 'Carly', 'Simon'];
var currentPlayer = 0;
var level = 1;


function nextPlayer () {
  //Add one each time to change players,
  //but never go above the max number of players.
  currentPlayer = (currentPlayer + 1) % player.length;

  if (currentPlayer === 0) { //If we're back at the top of the list    
    return nextLevel();
  }
  play(); //Next player plays.
}

function nextLevel () {
  level++;
  if (level > 3) {
      return console.log("Game Done");
  }

  play(); //Start next level
}

function play () {
  console.log(player[currentPlayer] + " is playing level " + level);
  nextPlayer();
}

play(); //start the Game flow
```

- Skipped hit piece problem
- keeping attributes where they belong. (swing function)getting it over there  and why it's important.
- Redo CSS for game pieces with function? Explain
- vh sizing
