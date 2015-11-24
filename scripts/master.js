/*global $, console, alert, document, window*/
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
	this.level = 0;
	this.activePlayer = null;
	this.$scoreboard = $('<section id="score">');
	this.$map = $('<section id="map">');
	this.$board = $('<section>').append(this.$scoreboard).append(this.$map); //board is made up of scoreboard and map sections
	this.playerList = []; //player list.  Linked to each player's object
	this.currentPlayer = null; //holds the player who's currently playing
};

Game.prototype = {
	//Data for how many pieces go on each level and how they should be styled.
	levelData: [
		{pieces: 6, grid: '3x2', speedFactor: 1, maxHitPieces: 5}, //Level 1 [0]
		{pieces: 9, grid: '3x3', speedFactor: 3, maxHitPieces: 10}, //Level 2 [1]
		{pieces: 12, grid: '4x3', speedFactor: 5, maxHitPieces: 15} //Level 3 [2]
	],
	
	//sets up the board for the beginning of a round
	setBoard: function () {
		this.$map.empty(); //removes last board if still there. (it leaves the scoreboard standing)
		var level = this.level, //get the current level
			grid = $('<div>').attr('id', 'grid-' + this.levelData[level].grid), //make the grid div with size setting in ID
			piece,
			i;
		
		for (i = 0; i < this.levelData[level].pieces; i++) { //loops for the number of pieces for the level
			piece = $('<div>').attr('class', 'passive cell-' + this.levelData[level].grid); //sets pieces' class
			grid.append(piece); //adds piece to the grid
		}
		
		grid.on('click', '.active', function (e) { //this is the Player.hit(). Move it!!!!!!!!!!!!!!!!!!!!!
			var target = e.target;
			target = $(target);
			//add one to the score
			score++;//score placeholder
			console.log(score);
			//make inactive again on hit
			target.removeClass('red-bg').addClass('green-bg');//on hit change color
			setTimeout(function () {
				target.removeClass('active green-bg').addClass('passive');//leave color up for a moment, and then change it back and make passive again
			}, 500);
		});
		this.$map.append(grid);
		$('#game').append(this.$map); //gets grid into the game
	},
	
	
	setScoreboard: function () {
		var level = this.level, //get the current level
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
		randCell = $passiveCells.eq(randCell);
		randCell.removeClass('passive').addClass('active red-bg'); //Change state of cell to active.
		
		setTimeout(function () {
			randCell.removeClass('active red-bg').addClass('passive');
		}, 2000 / this.levelData[this.level].speedFactor);
	},
	
	
	//Starts the round
	start: function (player) {
		var hitPieceNumber = 0;
		var scope = this;
		var interval = setInterval(function () {
			scope.showHitPiece();
			if (hitPieceNumber === scope.levelData[scope.level].maxHitPieces) {
				clearInterval(interval);
			}
			hitPieceNumber++;
		}, 1000);
	},

	runGame: function () {//the flow for a game
		//initialize game
		//[set boilerplate for game]
		//set Scoreboard
		this.setScoreboard();
		//for loop?????????????????????
		//round one
		this.level = 0;//Initialized above as 0;
		
			//player 0
		this.currentPlayer = this.playerList[0];
		
				//initialize board
		this.setBoard();
				//start()
		this.start();
			//switch to player 1
		this.currentPlayer = this.playerList[1];
				//start()
		this.start();
			//switch to round 2
		this.level++;
		
		
		
		
	}
};







//Player constructor function
var Player = function (name) {
	this.name = name;
	this.score = 0;
	this.accuracy = 0;
	this.completion = 0;
};

Player.prototype = {
	hit: function () {}
};


var round1 = new Game();
