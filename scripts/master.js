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

var Game = function () {
	this.level = 1;
	this.activePlayer = null;
	this.$scoreboard = $('<section id="score">');
	this.$board = $('<section id="map">');
};

Game.prototype = {
	setMap: function () {
		var level = this.level;
	},
	setScoreboard: function () {
		
	},
	showHit: function () {}
	
};


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