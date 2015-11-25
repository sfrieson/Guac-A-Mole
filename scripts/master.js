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






var score = 0; //PLACEHOLDER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



//game constructor function
var Game = function () {
	this.$scoreboard = $('<section id="score">');
	this.$map = $('<section id="map">');
	this.$board = $('<section>').append(this.$scoreboard).append(this.$map); //board is made up of scoreboard and map sections
	this.playerList = []; //Player list.  Linked to each player's object
	this.currentPlayer = 0; //Holds the index for playerList for the player who's currently playing. Initialized for first player
	this.currentLevel = 0; //Holds the index of levelData for the current level being played.  Initialized for first level
};

Game.prototype = {
	//-------------NOTE: Player creation Game.prototype.getPlayers() below the Player construtor function
	//Data for how many pieces go on each level and how they should be styled.
	levelData: [
		{pieces: 6, grid: '3x2', speedFactor: 1, maxHitPieces: 5}, //Level 1 [0]
		{pieces: 9, grid: '3x3', speedFactor: 3, maxHitPieces: 10}, //Level 2 [1]
		{pieces: 12, grid: '4x3', speedFactor: 5, maxHitPieces: 15} //Level 3 [2]
	],
	
	//Sets up the board for the beginning of a round
	setBoard: function () {
		this.$map.empty(); //Removes last board if still there. (it leaves the scoreboard standing)
		var scope = this,
			level = this.currentLevel, //get the current level
			grid = $('<div>').attr('id', 'grid-' + this.levelData[level].grid), //make the grid div with size setting in ID
			piece,
			i;
		
		for (i = 0; i < this.levelData[level].pieces; i++) { //Loops for the number of pieces for the level
			piece = $('<div>').attr('class', 'passive cell-' + this.levelData[level].grid); //sets pieces' class
			grid.append(piece); //Adds one new piece to the grid
		}
		
		grid.on('click', '.active', function (e) { //When an active cell is clicked
			//Call the Player's hit function sending the hit target as an argument
			scope.playerList[scope.currentPlayer].hit(e.target);
		});
		this.$map.append(grid);
		$('#game').append(this.$map); //gets grid into the game
	},
	
	
	setScoreboard: function () {
		var level = this.currentLevel, //get the current level
			scoreboard = $('<div>').attr('id', 'scoreboard');
		var text = "<h2>Welcome to Level " + (level + 1) + "</h2>";
		scoreboard.html(text);
		
		$('#game').append(scoreboard);
	},
	
	
	//Sets a cell to be active to hit for limited time
	showHitPiece: function () {
		var scope = this;
		var $passiveCells = $('.passive');
		var randCell = parseInt(Math.random() * $passiveCells.length, 10);//select random number possible for available passive divs
		randCell = $passiveCells.eq(randCell); //Use that random number to select the corresponding random cell.
		randCell.removeClass('passive').addClass('active red-bg'); //Change state of cell to active for hit.
		
		setTimeout(function () {  //length of time cell is active before it becomes passive again
			randCell.removeClass('active red-bg').addClass('passive');
		}, 2000 / this.levelData[this.currentLevel].speedFactor); //the time is different for each level
	},
	
	
	//Starts the round
	start: function (player) {
		var hitPieceNumber = 0;
		var scope = this;
		//Add pre game count down etc...???????????????????????????
		//Starts game action
		var interval = setInterval(function () {
			scope.showHitPiece(); //each interval make another hit pieces
			
			if (hitPieceNumber === scope.levelData[scope.currentLevel].maxHitPieces) {
				clearInterval(interval);
			}
			hitPieceNumber++;
		}, 1000);
		
	},

	runGame: function () {//the flow for a game
		var level, playerCounter;
		//initialize game
		//[set boilerplate for game]!!!!!!!!!!!!!!!
		//set Scoreboard
		this.setScoreboard();
		//for loop?????????????????????
		
		
		for (level = 0; level < this.levelData.length; level++) { //Level loop
			this.currentLevel = level;//Initialized above as 0. Change above to null????????????
			console.log("Level: " + this.currentLevel);
			//initialize board (once a round)
			this.setBoard(); //
			console.log("Set board for level " + this.currentLevel);
			for (playerCounter = 0; playerCounter < this.playerList.length; playerCounter++) { //players take turns per round.
				//set player (as many times as necessary per round)
				this.currentPlayer = this.playerList[playerCounter];
				console.log("Set current player as: " + this.currentPlayer);
				//start() (as many times as players)
				this.start();
				console.log("Start Game");
				//switching players taken care of by the loop iterator
			}
			//changing level taken care of by the loop iterator
		}
		
		
		
	}
};




//Player constructor function
//constructor is called by the game and takes an argument of the game to link them up
var Player = function (game, name) {//game is scope of the currently played game.
	this.game = game; //sets game argument as variable to use in prototype
	this.name = name;
	this.score = 0;
	this.accuracy = 0;
	this.completion = 0;
};

Player.prototype = {
	
	gameScope: this.game,
	
	//was originally on the Game.prototype
	hit: function (target) {
		target = $(target);
			
		this.score++; //add one to the score
		console.log(this.score);
			//Make inactive for multiple hits, and allow hit styling
		target.removeClass('red-bg active').addClass('green-bg hit');
			//after a half second reset defaults
		setTimeout(function () {
			target.removeClass('green-bg hit').addClass('passive');//change color for a moment, and then make cell passive again
		}, 500);
		
	}
};

//create players
Game.prototype.getPlayers = function () {
	var name = prompt("What is player 1's name?");
	var player = new Player(this, name);
	this.playerList.push(player);
}



var game = new Game();
