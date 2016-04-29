$(document).ready(gameTime);


function gameTime() {
	var game = new Game();
	game.preGame();
}


//game constructor function
var Game = function () {
	this.$scoreboard = $('<section id="score">'); //Left side of the game
	this.map = $('<section id="map">'); //Right side of the board
	this.$board = $('<section>').append(this.$scoreboard).append(this.map); //Board is made up of scoreboard and map sections
	this.playerList = []; //Link to each player's object. Populated by Game.getPlayers()
	this.currentPlayer = 0; //Holds the index for playerList for currently playing. Initialized for first player.
	this.currentLevel = 0; //Holds the index of levelData for level being played.  Initialized for first level.
};


	//Data for how many pieces go on each level and how they should be styled.
Game.prototype.levelData = [
	{pieces: 6, grid: '3x2', speedFactor: 1050, showLength: 2000, maxHitPieces: 5, pointValue: 1}, //Level 1
	{pieces: 9, grid: '3x3', speedFactor: 450, showLength: 1000, maxHitPieces: 15, pointValue: 5}, //Level 2
	{pieces: 12, grid: '4x3', speedFactor: 350, showLength: 700, maxHitPieces: 25, pointValue: 10} //Level 3
];

	//Changes the player before the start of each round
Game.prototype.changePlayer= function () {
	$('.player-' + this.currentPlayer).parent().removeClass('dorange'); //Un-highlight player at start of round

	//Tricky way to iterate through the players but only as high as the number of players there are.
	this.currentPlayer = (this.currentPlayer + 1) % this.playerList.length;

	$('.player-' + this.currentPlayer).parent().addClass('dorange'); //Highlight next player

	if (this.currentPlayer === 0) { //When we're back to the top of the player list...
		return this.changeLevel(); // ...change the level and don't finish up this function and don't finish up the function.
	}

	console.log("Now playing..." + this.playerList[this.currentPlayer].name);
	this.countdown(); //(After if...) Otherwise, start up the game for the new player.
};

//Changes the level after each player has played it
Game.prototype.changeLevel = function () {

	//Tricky way to iterate through the levels but only as high as the number of levels there are.
	this.currentLevel = (this.currentLevel + 1) % this.levelData.length;
	if (this.currentLevel === 0) { //When we've gone through all the levels...
	return this.recap(); //On to the end of the game
}
$('#scoreboard-title').text("Level " + (this.currentLevel + 1));
console.log("Now for level " + this.currentLevel);
console.log("Now playing..." + this.playerList[this.currentPlayer].name);
this.setBoard(); //(After if...) Otherwise, swap out the grid for the new level.
this.countdown(); //Start up the next round.
};

	//Sets up the board for the beginning of each level
Game.prototype.setBoard = function () {
	this.map.empty(); //Removes last grid. (it leaves the scoreboard standing)
	var scope = this;
	var	level = this.currentLevel; //get the current level
	var	grid = $('<div>').attr('id', 'grid-' + this.levelData[level].grid); //make the grid div with size setting in ID
	var	piece;
	var	i;

	for (i = 0; i < this.levelData[level].pieces; i++) { //Loops for the number of pieces for the level
		piece = $('<div>').addClass('passive cell-' + this.levelData[level].grid); //sets pieces' class
		grid.append(piece); //Adds one new piece to the grid
	}

	grid.mousedown(function (e) { //When an anywhere on grid is clicked...
		//... call that player's swing function sending
		scope.playerList[scope.currentPlayer].swing(e);
	});

	this.map.append(grid);
	$('#game').append(this.map);
	console.log("Gameboard loaded.");
};

	//Sets up the scoreboard at the beginning of the game.
Game.prototype.setScoreboard = function () {
	var scoreboard = $('<div id="scoreboard">'); //Contains name and score of each player
	var title = $('<h2 id="scoreboard-title">').text("Level " + (this.currentLevel + 1));
	var i;

	scoreboard.append(title);

	for (i = 0; i < this.playerList.length; i++) {
		var holder = $('<div>').addClass('player');
		var playerName = $('<h3>').addClass('player-name').text(this.playerList[i].name);
		var score = $('<div>').addClass('score player-' + this.playerList[i].id).text(0);

		holder.append(playerName).append(score);
		scoreboard.append(holder);
	}


	$('#game').append(scoreboard);
	console.log("Scoreboard loaded.");
};


//Sets a cell to be active to hit for limited time
Game.prototype.showHitPiece = function () {
	var scope = this;
	var $passiveCells = $('.passive');
	var randCell = parseInt(Math.random() * $passiveCells.length, 10); //Selects random number possible for available .passive divs
	var showLength = this.levelData[this.currentLevel].showLength; //Grabs the length of time piece is shown for this level.
	var image = $('<img src="images/avocado.gif?' + Math.random() + '">');
	randCell = $passiveCells.eq(randCell); //Use that random number to select the corresponding random .passive cell.
	randCell.removeClass('passive').addClass('active').append(image); //Change state of cell to .active for hit.

	setTimeout(function () {  //length of time cell is active before it becomes passive again
		randCell.removeClass('active red-bg').addClass('passive');
		image.remove();
	}, showLength);
};


//Starts the round
Game.prototype.start = function () {
	console.log("Start of round.");
	var scope = this;
	var	hitPiecesRemaining = scope.levelData[scope.currentLevel].maxHitPieces; //How many pieces show on this level
	var	speedFactor = this.levelData[this.currentLevel].speedFactor; //How often pieces show on this level

	//Starts game action
	var interval = setInterval(function () { //Like a for loop
		if (hitPiecesRemaining === 0) {
			clearInterval(interval);//Stop loop when no more pieces are remaining
			console.log("End of round.");
			return setTimeout(function () {
				scope.changePlayer(); //Pauses before we go to the next player

			}, 3000);

		}

		scope.showHitPiece(); //Each interval makes another hit piece
		hitPiecesRemaining--;
	}, speedFactor);
};

	//Runs the game
Game.prototype.run = function () {//The flow for a game.  Called once per game.
	//Initialize document.body This all only happens once.
	$('body').empty(); //Remove Act I title screens or previous game (play again).
	var container = $('<main>');
	var	gameDiv = $('<div id="game">');
	container.append(gameDiv);
	$('body').append(container);
	this.setScoreboard();//Set scoreboard
	$('.player-' + this.currentPlayer).parent().addClass('dorange'); //Highlights the first player up (only necessary first time)
	this.setBoard(); //Set playing board
	this.countdown(); //Starts level countdown
};

	//Countdowns before each round
Game.prototype.countdown = function () {
	var scope = this;
	var popUp = $('<div class="pop-up">'); //Covers playing board
	popUp.append("<h2>Are you ready " + this.playerList[this.currentPlayer].name + "?</h2>");
	this.map.prepend(popUp); //Prepend to make sure it is at the top of the flow and covers everything

	function count() { //changes the number ever second

		var number = $('<div id="countdown">');
		popUp.append(number);
		var i = 3;
		var counter = setInterval(function () {
			number.text(i).css('opacity', 1);
			number.animate({opacity: 0}, 600);

			if (i === 0) {
				clearInterval(counter);
				popUp.remove();
				return scope.start();
			}
			i--;
		}, 1000);
	}

	setTimeout(count, 1500); //Does this all after seeing the new screen for a moment
};

	//Shows how player(s) did at the end of game
Game.prototype.recap = function () {
	var fullScreen = $('<div class="full-screen orange-bg">').css('top', '200vh');
	var rapSheet;
	var	score;
	var	finalScore;
	var	scope = this;
	var	i;
	var completion;
	var accuracy;
	$('body').append(fullScreen);
	fullScreen.append('<h1>Results...</h1>');
	fullScreen.animate({top: "0vh"}, 600);



	for (i = 0; i < this.playerList.length; i++) {
		//Shows all players and their game scores
		rapSheet = $('<section>').addClass('rap-sheet');
		rapSheet.css({
			width: 100 / this.playerList.length + "%" //Makes sure all players fit across
		});
		rapSheet.append(this.playerList[i].name);
		fullScreen.append(rapSheet);
		score = $('<div>').text(this.playerList[i].score);
		rapSheet.append(score);

		accuracy = Math.floor(this.playerList[i].getAccuracy() * 50);
		this.playerList[i].score += accuracy;
		rapSheet.append('<div>Accuracy bonus: ' + accuracy + '</div>');

		completion = Math.floor(this.playerList[i].getCompletion() * 50);
		this.playerList[i].score += completion;
		rapSheet.append('<div>Completion bonus: ' + completion + '</div>');

		//Compares totals
		if (!this.winner || //If winner is still null...
			this.playerList[i].score > this.winner.score) { //...or this player's score is higher than the current winner's
			this.winner = this.playerList[i];
		}

		finalScore = $('<div>Final Score:<br><strong> ' + this.playerList[i].score + ' </strong></div>').addClass('final-score');
		rapSheet.append(finalScore);



	}

	//highlight winner
	$('.rap-sheet').eq(this.winner.id).addClass('winner');
};

Game.prototype.preGame = function () {
	//Title Screen
	var title = $('<section id="title" class="full-screen yellow-bg">');
	var text = $('<h1 class="green">').text('Guac-a-Mole');
	var scope = this;
	title.append(text);
	$('body').append(title);
	text.animate(
		//CSS properties to move toward
		{
			fontSize: "18vh"
		},
		//Duration
		700,
		//easing
		'swing',
		//On completion do this function
		function () {
			var game = new Game(); //Create the game
			return setTimeout(function () {scope.playerScreen(); }, 1000); //Go to player creation
		}
	);
};

// Creates players and populates the playerList[];
Game.prototype.makePlayers = function (playerInput) {
	for (var i = 0; i < (playerInput.length - 1); i++) { //The last input is the submit button
		var name = playerInput[i].value ||
		"Player " + (i + 1); //Default name "Player [id]"

		this.playerList.push(new Player(this, name));
	}
};

//Gets input on number of players and their names
Game.prototype.playerScreen = function () {
	var i;
	//Set-up the page
	var getPlayers = $('<section id="get-players">');
	getPlayers.append('<div class="full-screen green-bg">');
	getPlayers = getPlayers.children().eq(0);
	getPlayers.append('<h1>How many players?</h1>');
	//buttons
	for (i = 1; i <= 4; i++) {
		var button = $('<button>').addClass('red-bg').text(i);

		getPlayers.append(button);
	}


	var scope = this;
	$('body').prepend(getPlayers);
	$('#title').animate({left: "-200vw"}, 400, 'swing', function () {this.remove(); });//Animate title off screen and remove it.

	getPlayers.on('click', 'button', function (e) {

		$('h1').text("Player names:");
		$('button').remove();
		var form = $('<form>');
		getPlayers.append(form);
		for (i = 1; i <= e.target.innerText; i++) {
			var formInput =
			'<div class="player-input-section">' +
			'<label for="Player ' + i + '">' +
			'<h2>Player ' + i + ':</h2>' +
			'</label>';
			if (i === 1) {
				formInput += '<input type="text" autofocus>' + //Adds autofocus to the first input
				'</div>';
			} else {
				formInput += '<input type="text">' +
				'</div>';
			}
			form.append(formInput);
		}
		form.append('<input type="submit" id="play" class="button orange-bg" value="Let\'s go!">');
		form.submit(function (e) {
			e.preventDefault();
			scope.makePlayers($('input'));
			scope.run();
		});
	});
};





// Player constructor function
// Constructor is called by the game and takes an argument of the game to link them up
var Player = (function (){
	var id = -1;
	return function (game, name) { //game is scope of the currently played game.
		this.game = game; //sets game argument as variable for use in prototype
		this.name = name;
		this.id = ++id; //To avoid confusion of multiple players with same name
		this.score = 0;
		this.swings = 0;
		this.hits = 0;
		this.accuracy = this.getAccuracy;
		this.completion = this.getCompletion;
	};
})();


	// What happens when player swings
Player.prototype.swing= function (e) {
	var game = this.game;
	var target = $(e.target.parentElement);


	this.swings++; //Countevery swing.
	console.log("Swing " + this.swings);

	if (e.target.hasAttribute('src')) {// If the swing was a hit (because they clicked an img that only shows for active divs)
		this.hits++;
		console.log("Hit " + this.hits);
		this.score += game.levelData[game.currentLevel].pointValue; //Add to the score depend on level's point value.
		$('.player-' + this.id).text(this.score);
		console.log(this.score);
		//Make inactive to avoid multiple hits, and allow hit styling
		//Change color for a moment, and then make cell passive again
		target.removeClass('active').text("").addClass('hit');
		//After a half second reset defaults
		setTimeout(function () {
			target.removeClass('hit').addClass('passive');
		}, 500);
	}
};

	// Calculates the players accuracy
Player.prototype.getAccuracy= function () {
		return this.hits / this.swings;
	};

	// Calculates the percentage of hit pieces successfully hit
Player.prototype.getCompletion= function () {
	//get max number of possible hits
	var maxPossible = 0;
	this.game.levelData.forEach(function (currentObject) { //levelData is an array of objects
		maxPossible += currentObject.maxHitPieces;
	});

	return this.hits / maxPossible;
};
