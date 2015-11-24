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

//Data for how many pieces go on each level and how they should be styled.
var levelData = [
	{pieces: 6, grid: '3x2'},
	{pieces: 9, grid: '3x3'},
	{pieces: 12, grid: '4x3'}
];


//game constructor function
var Game = function () {
	this.level = 0;
	this.activePlayer = null;
	this.$scoreboard = $('<section id="score">');
	this.$map = $('<section id="map">');
	this.$board = $('<section>').append(this.$scoreboard).append(this.$map); //board is made up of scoreboard and map sections
};

Game.prototype = {
	//sets up the board for the beginning of a round
	setBoard: function () {
		var level = this.level, //get the current level
			grid = $('<div>').attr('id', 'grid-' + levelData[level].grid), //make the grid div with size setting in ID
			position = 0,
			piece,
			i;
		
		for (i = 0; i < levelData[level].pieces; i++) { //loops for the number of pieces for the level
			piece = $('<div>').attr('class', 'passive cell-' + levelData[level].grid); //sets pieces' class
			grid.append(piece); //adds piece to the grid
			position++;
		}
		$('#game').append(grid); //gets grid to the game
	},
	
	
	setScoreboard: function () {
		
	},
	
	//Sets a cell to be active for hit for limited time
	showHitPiece: function () {
		var scope = this;
		var $passiveCells = $('.passive');
		var randCell = parseInt(Math.random() * $passiveCells.length, 10);//select random number possible for available passive divs
		randCell = $passiveCells.eq(randCell);
		randCell.removeClass('passive'); //Change statue of cell to active.
		randCell.addClass('active red-bg');
		setTimeout(function () {
			randCell.removeClass('active red-bg');
			randCell.addClass('passive');
		}, 2000);
		clearInterval();
	
	},
	start: function () {
		var hit = 0;
		var scope = this;
		var interval = setInterval(function () {
			scope.showHitPiece();
			console.log(hit);
			if (hit === 5) {//not working yet
				clearInterval(interval);
			}
			hit++;
		}, 1000);
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
/*
Act II
	decide level
	set board for that level
	pop up at random interval
*/