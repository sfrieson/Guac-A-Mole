/*global $, console, alert, prompt, document, window*/
'use strict';
/*
Game
	level
	board
	hit pieces
	timer/counter => time left/number of hit pieces left
	scoreboard
	whose turn


Player
	name
	hit()
	score
	accuracy rate
	completion rate
*/





//game constructor function
var Game = function () {
	this.$scoreboard = $('<section id="score">');
	this.map = $('<section id="map">');
	this.$board = $('<section>').append(this.$scoreboard).append(this.map); //board is made up of scoreboard and map sections
	this.playerList = []; //Player list.  Linked to each player's object
	this.currentPlayer = 0; //Holds the index for playerList for the player who's currently playing. Initialized for first player
	this.currentLevel = 0; //Holds the index of levelData for the current level being played.  Initialized for first level
};

Game.prototype = {
	//-------------NOTE: Player creation Game.prototype.getPlayers() below the Player construtor function
	//Data for how many pieces go on each level and how they should be styled.
	levelData: [
		{pieces: 6, grid: '3x2', speedFactor: 1050, showLength: 2000, maxHitPieces: 5, pointValue: 1}, //Level 1 [0]
		{pieces: 9, grid: '3x3', speedFactor: 450, showLength: 1000, maxHitPieces: 15, pointValue: 5}, //Level 2 [1]
		{pieces: 12, grid: '4x3', speedFactor: 350, showLength: 700, maxHitPieces: 25, pointValue: 10} //Level 3 [2]
	],

	//Changes the player at the beginning of end of each start of the level
	changePlayer: function () {
		$('.player-' + this.currentPlayer).parent().removeClass('dorange'); //Un-highlight player
		//Tricky way to iterate through the players but only as high as the number of players there are.
		this.currentPlayer = (this.currentPlayer + 1) % this.playerList.length;
		$('.player-' + this.currentPlayer).parent().addClass('dorange'); //Highlight next player

		if (this.currentPlayer === 0) { //When we're back to the top of the player list...
			return this.changeLevel(); // ...change the level and don't finish up this function and don't finish up the function.
		}
		console.log("Now playing..." + this.playerList[this.currentPlayer].name);
		this.countdown(); //Otherwise, start up the game for the new player.
	},

	//Changes the level after each player has played it
	changeLevel: function () {

		//Tricky way to iterate through the players but only as high as the number of players there are.
		this.currentLevel = (this.currentLevel + 1) % this.levelData.length;
		if (this.currentLevel === 0) { //When we've gone through all the levels...
			return this.recap(); //On to Act III
		}
		$('#scoreboard-title').text("Level " + (this.currentLevel + 1));
		console.log("Now for level " + this.currentLevel);
		console.log("Now playing..." + this.playerList[this.currentPlayer].name); //Necessary for the first player of the round.
		this.setBoard(); //Otherwise, swap out the grid for the new level.
		this.countdown(); //Start up the next round.
	},

	//Sets up the board for the beginning of a round
	setBoard: function () {
		this.map.empty(); //Removes last board. (it leaves the scoreboard standing)
		var scope = this,
			level = this.currentLevel, //get the current level
			grid = $('<div>').attr('id', 'grid-' + this.levelData[level].grid), //make the grid div with size setting in ID
			piece,
			i;

		for (i = 0; i < this.levelData[level].pieces; i++) { //Loops for the number of pieces for the level
			piece = $('<div>').attr('class', 'passive cell-' + this.levelData[level].grid); //sets pieces' class
			grid.append(piece); //Adds one new piece to the grid
		}

		grid.mousedown(function (e) { //When an active cell is clicked
			//Call the Player's swing function sending what was hit as an argument
//			debugger;
			scope.playerList[scope.currentPlayer].swing(e);
		});
		this.map.append(grid);
		$('#game').append(this.map); //gets grid into the game
		console.log("Gameboard loaded.");
	},


	setScoreboard: function () {
		var i;
		var scoreboard = $('<div>').attr('id', 'scoreboard'); //Make the div
		var title = $('<h2>').attr('id', 'scoreboard-title').text("Level " + (this.currentLevel + 1));
		scoreboard.append(title);

		for (i = 0; i < this.playerList.length; i++) {
			var holder = $('<div>');
			var playerName = $('<h3>').text(this.playerList[i].name);
			var score = $('<div>').attr('class', 'score player-' + this.playerList[i].id).text(0);
			holder.append(playerName).append(score);
			scoreboard.append(holder);
		}


		$('#game').append(scoreboard);
		console.log("Scoreboard loaded.");
	},


	//Sets a cell to be active to hit for limited time
	showHitPiece: function () {
		var scope = this;
		var $passiveCells = $('.passive');
		var randCell = parseInt(Math.random() * $passiveCells.length, 10);//select random number possible for available passive divs
		var showLength = this.levelData[this.currentLevel].showLength; //grabs the showLength for this level.
		var image = $('<img src="images/avocado.gif?' + Math.random() + '">');
		randCell = $passiveCells.eq(randCell); //Use that random number to select the corresponding random cell.
		randCell.removeClass('passive').addClass('active').append(image); //Change state of cell to active for hit.

		setTimeout(function () {  //length of time cell is active before it becomes passive again
			randCell.removeClass('active red-bg').addClass('passive');
			image.remove();
		}, showLength); //the time is different for each level
	},


	//Starts the round
	start: function (player) {
		console.log("Start of round.");
		var scope = this,
			hitPiecesRemaining = scope.levelData[scope.currentLevel].maxHitPieces,
			speedFactor = this.levelData[this.currentLevel].speedFactor;

		//Starts game action
		var interval = setInterval(function () { //Like a for loop
			if (hitPiecesRemaining === 0) {
				clearInterval(interval);//Stop loop
				console.log("End of round.");
				//create a button or timed flow with a button at the end to start next player.
				return setTimeout(function () {
					scope.changePlayer();

				}, 5000);//placeholder to change player after 5 seconds!!!!!!!!!!!!!!!!!!

			}

			scope.showHitPiece(); //Each interval makes another hit piece
			hitPiecesRemaining--;
		}, speedFactor);

	},

	run: function () {//The flow for a game.  Called once per game.
		//Initialize document.body This all only happens once.
		$('body').empty(); //Remove Act I title screens or previous game (play again).
		var container = $('<div id="container">'),
			gameDiv = $('<div id="game">');
		container.append(gameDiv);
		$('body').append(container);
		this.setScoreboard();//Set scoreboard
		$('.player-' + this.currentPlayer).parent().addClass('dorange');
		this.setBoard();//Set playing board
		this.countdown();

	},

	countdown: function () {
		var scope = this;
		var popUp = $('<div class="pop-up">');
		popUp.append("<h2>Are you ready " + this.playerList[this.currentPlayer].name + "?</h2>");
		this.map.prepend(popUp);

		function count() {

			var number = $('<div>').css('fontSize', "10em");
			popUp.append(number);
			var i = 0,
				text = ['3...', '2...', '1...', 'GO!'];
			var counter = setInterval(function () {
				number.text(text[i]).css('opacity', 1);
				number.animate({opacity: 0}, 600);
				i++;
				if (i > 3) {
					clearInterval(counter);
					popUp.remove();
					return scope.start();
				}
			}, 1300);

		}

		setTimeout(count, 1500);
	},

	recap: function () {
		var fullScreen = $('<div class="full-screen orange-bg">').css('top', '200vh');
		var rapSheet,
			score,
			finalScore,
			scope = this,
			i;
		$('body').append(fullScreen);
		fullScreen.append('<h1>Results...</h1>');
		fullScreen.animate({top: "0vh"}, 600);

		for (i = 0; i < this.playerList.length; i++) {
			//show all players and their scores
			rapSheet = $('<section class="rap-sheet">');
			rapSheet.css({
				width: 100 / this.playerList.length + "%",
				display: 'inline-block',
				height: "100vh",
				overflow: "none"
			});
			rapSheet.append(this.playerList[i].name);
			fullScreen.append(rapSheet);
			score = $('<div>').text(this.playerList[i].score);
			rapSheet.append(score);


		//add all accuracy points

			var accuracy = Math.floor(this.playerList[i].getAccuracy() * 50);
			this.playerList[i].score += accuracy;
			rapSheet.append('<div>Accuracy bonus: ' + accuracy + '</div>');


		//add all completeion points
			var completion = Math.floor(this.playerList[i].getCompletion() * 50);
			this.playerList[i].score += completion;
			rapSheet.append('<div>Completion bonus: ' + completion + '</div>');

			finalScore = $('<div>Final Score:<br><strong> ' + this.playerList[i].score + ' </strong></div>');
			rapSheet.append(finalScore);
		//compare totals

			if (!this.winner ||
					this.playerList[i].score > this.winner.score) {
				this.winner = this.playerList[i];
			}

			//highlight winner (if more than one player playing)
			$('.rap-sheet').eq(this.winner.id).addClass('green-bg');


		}
	},
	
	cursor: $('<div id="cursor">')

};



//Player constructor function
//constructor is called by the game and takes an argument of the game to link them up
var Player = function (game, name) { //game is scope of the currently played game.
	this.game = game; //sets game argument as variable to use in prototype
	this.name = name;
	this.id = this.game.playerList.length; //For if multiple players with same name
	this.score = 0;
	this.swings = 0;
	this.hits = 0;
	this.accuracy = this.getAccuracy;
	this.completion = this.getCompletion;
};

Player.prototype = {
	//Functionality when there is a sing.
	swing: function (e) {
		var game = this.game;
		var target = $(e.target.parentElement);
		

		this.swings++; //Countevery swing.
		console.log("Swing " + this.swings);

		if (e.target.hasAttribute('src')) {// If the swing was a hit (because they clicked an img that only shows for active divs)
			this.hits++;
			console.log("Hit " + this.hits);
			this.score = this.score + game.levelData[game.currentLevel].pointValue; //Add to the score depend on level's point value.
			$('.player-' + this.id).text(this.score);
			console.log(this.score);
				//Make inactive for multiple hits, and allow hit styling
//			debugger;
			target.removeClass('active').text("").addClass('hit');
				//After a half second reset defaults
			setTimeout(function () {
				target.removeClass('hit').addClass('passive');//Change color for a moment, and then make cell passive again
			}, 500);
		}
	},

	getAccuracy: function () {
		return this.hits / this.swings;
	},

	getCompletion: function () {
		//get max number of possible hits
		var maxPossible = 0;
		this.game.levelData.forEach(function (currentObject) { //levelData is an array of objects
			maxPossible += currentObject.maxHitPieces;
		});

		return this.hits / maxPossible;
	}
};



//Create players
//Defined after the Player constructor function to have access to it.
Game.prototype.makePlayers = function (playerInput) {
	var i = 0;
	for (i = 0; i < (playerInput.length - 1); i++) { //The last input is the submit button
		var name = playerInput[i].value ||
			"Player " + (i + 1); //Default name "Player [id]"
		var player = new Player(this, name);
		this.playerList.push(player);
	}
};






//Act I


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

Game.prototype.playerScreen = function () {
	var i;
	//Set-up the page
	var getPlayers = $('<section id="get-players">');
	getPlayers.append('<div class="full-screen green-bg">');
	getPlayers = getPlayers.children().eq(0);
	getPlayers.append('<h1>How many players?</h1>');
	//buttons
	for (i = 1; i < 5; i++) {
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
				'<div class="player">' +
				'<label for="Player ' + i + '">' +
				'<h2>Player ' + i + ':</h2>' +
				'</label>' +
				'<input type="text">' +
				'</div>';
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



var game = new Game();
game.preGame();
