var display = {
  $scoreboard: $('<section id="score">'), //Left side of the game
	map: $('<section id="map">'), //Right side of the board
	$board: $('<section>').append(this.$scoreboard).append(this.map) //Board is made up of scoreboard and map sections
};

//Runs the game
display.run = function () {//The flow for a game.  Called once per game.
  //Initialize document.body This all only happens once.
  $('body').empty(); //Remove Act I title screens or previous game (play again).
  var container = $('<main>');
  var	gameDiv = $('<div id="game">');
  container.append(gameDiv);
  $('body').append(container);
  game.currentPlayer = game.playerList[0];
  display.setScoreboard();//Set scoreboard
  $('.player-' + game.currentPlayer.id).parent().addClass('dorange'); //Highlights the first player up (only necessary first time)
  display.setBoard(game.currentLevel); //Set playing board
  display.countdown(); //Starts level countdown
};

//Sets up the board for the beginning of each level
display.setBoard = function (level) {
  // this.map.empty(); //Removes last grid. (it leaves the scoreboard standing)
  var	grid = $('<div>').attr('id', 'grid-' + level.grid); //make the grid div with size setting in ID

  for (var i = 0; i < level.pieces; i++) { //Loops for the number of pieces for the level
    var piece = $('<div>').addClass('passive cell-' + level.grid); //sets pieces' class
    grid.append(piece); //Adds one new piece to the grid
  }

  grid.mousedown(function (e) { //When an anywhere on grid is clicked...
    //... call that player's swing function sending
    game.currentPlayer.swing(e.target);
  });

  this.map.html(grid);
  $('#game').append(this.map);
  console.log("Gameboard loaded.");
};

//Sets up the scoreboard at the beginning of the game.
display.setScoreboard = function () {
  var scoreboard = $('<div id="scoreboard">'), //Contains name and score of each player
      title = $('<h2 id="scoreboard-title">').text("Level " + (game.currentLevel.id)),
      players = game.playerList,
      i;

  scoreboard.append(title);

  for (i = 0; i < players.length; i++) {
  	var holder = $('<div>').addClass('player');
  	var playerName = $('<h3>').addClass('player-name').text(players[i].name);
  	var score = $('<div>').addClass('score player-' + players[i].id).text(0);

  	holder.append(playerName).append(score);
  	scoreboard.append(holder);
  }

  $('#game').append(scoreboard);
  console.log("Scoreboard loaded.");
};

//Countdowns before each round
display.countdown = function () {
	var popUp = $('<div class="pop-up">'); //Covers playing board
	popUp.append( $('<h2>').text("Are you ready " + game.currentPlayer.name + "?") );
	this.map.prepend(popUp); //Prepend to make sure it is at the top of the flow and covers everything

	function count() { //changes the number every second

		var number = $('<div id="countdown">');
		popUp.append(number);
		var i = 3;
		var counter = setInterval(function () {
      if (i === 0) {
				clearInterval(counter);
				popUp.remove();
				return game.start();
			}
			number.text(i--).css('opacity', 1);
			number.animate({opacity: 0}, 600);

		}, 1000);
	}

	setTimeout(count, 1500); //Does this all after seeing the new screen for a moment
};

display.changePlayer = function() {
  $('.player-' + game.currentPlayer.id).parent().removeClass('dorange'); //Un-highlight player at start of round
  var newPlayer = game.nextPlayer();
  $('.player-' + newPlayer.id).parent().addClass('dorange'); //Highlight next player

  if (newPlayer.id === 0) { //When we're back to the top of the player list...
		return game.changeLevel();
	}

  console.log("Now playing..." + newPlayer.name);
	display.countdown(); //(After if...) Otherwise, start up the game for the new player.
}

display.startLevel = function (level) {
  $('#scoreboard-title').text("Level " + level.id);
  console.log("Now for level " + level.id);
  console.log("Now playing..." + this.currentPlayer.name);
  display.setBoard(level); //(After if...) Otherwise, swap out the grid for the new level.
  display.countdown(); //Start up the next round.
}

//Sets a cell to be active to hit for limited time
display.showHitPiece = function () {
	var randCell = game.randomPassiveCell();
	var image = $('<img>').attr('src', "images/avocado.gif?" + Date.now());
	randCell.removeClass('passive').addClass('active').append(image); //Change state of cell to .active for hit.

	setTimeout(function () {  //length of time cell is active before it becomes passive again
		randCell.removeClass('active red-bg').addClass('passive');
		image.remove();
	}, game.currentLevel.showLength);//Grabs the length of time piece is shown for this level.
};

display.successfulHit = function(target) {
  $('.player-' + this.currentPlayer.id).text(this.currentPlayer.score);
  console.log(this.currentPlayer.score);
  //Make inactive to avoid multiple hits, and allow hit styling
  //Change color for a moment, and then make cell passive again
  target.removeClass('active').text("").addClass('hit');
  //After a half second reset defaults
  setTimeout(function () {
    target.removeClass('hit').addClass('passive');
  }, 500);
}

display.recap = function (playerList) {
	var fullScreen = $('<div class="full-screen orange-bg">').css('top', '200vh');

	var	finalScore;
	$('body').append(fullScreen);
	fullScreen.append('<h1>Results...</h1>');
	fullScreen.animate({top: "0vh"}, 600);

	for (var i = 0; i < game.playerList.length; i++) {
		//Shows all players and their game scores
		var rapSheet = $('<section>').addClass('rap-sheet').css({
			width: 100 / playerList.length + "%" //Makes sure all players fit across
		});
		rapSheet.append(playerList[i].name);
		fullScreen.append(rapSheet);
		rapSheet.append(score);

		rapSheet.append('<div>Accuracy bonus: ' + accuracy + '</div>');

		rapSheet.append('<div>Completion bonus: ' + completion + '</div>');

		//Compares totals
		if (!this.winner || //If winner is still null...
			playerList[i].score > this.winner.score) { //...or this player's score is higher than the current winner's
			this.winner = playerList[i];
		}

		finalScore = $('<div>Final Score:<br><strong> ' + playerList[i].score + ' </strong></div>').addClass('final-score');
		rapSheet.append(finalScore);

	}
}
