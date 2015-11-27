/*global $, console, alert, prompt, document, window*/
'use strict';
var Game = {
	levelData: [
		{maxHitPieces: 5},
		{maxHitPieces: 15},
		{maxHitPieces: 25}
	],

	playerList: [john, wendy, peter, nana],

	recap: function () {
		var fullScreen = $('<div class="full-screen orange-bg">').css('top', '200vh');
		var rapSheet,
			score,
			finalScore;
		$('body').append(fullScreen);
		fullScreen.append('<h1>Results...</h1>');
		fullScreen.animate({top: "0vh"}, 600);

		for (var i = 0; i < this.playerList.length; i++){
			//show all players and their scores
			rapSheet = $('<section class="rap-sheet">');
			rapSheet.css({
				width: 100/this.playerList.length + "%",
				display: 'inline-block',
				height: "100vh",
				overflow: "none"
			});
			rapSheet.append(this.playerList[i].name);
			fullScreen.append(rapSheet);
			score = $('<div>').text(this.playerList[i].score)
			rapSheet.append(score);


		//add all accuracy points

			var accuracy = Math.floor(this.playerList[i].getAccuracy() * 50);
			this.playerList[i].score += accuracy;
			rapSheet.append('<div>Accuracy bonus: ' + accuracy + '</div>');


		//add all completeion points
			var completion = Math.floor(this.playerList[i].getCompletion() * 50);
			this.playerList[i].score += completion;
			rapSheet.append('<div>Completion bonus: ' + completion + '</div>');


			rapSheet.append('<div>Final Score:<br><strong>' + this.playerList[i].score + '</strong></div>');

		//compare totals
		if (!this.winner ||
			this.playerList[i].score > this.winner.score) {
			this.winner = this.playerList[i];
		}



		//highlight winner (if more than one player playing)
		$('.rap-sheet').eq(this.winner.id - 1).addClass('red-bg'); //remove minus 1 later !!!!!!!!!!!!!!!!!!!


		}
	}

	//ask to play again

};


var Player = function (game, name) {//game is scope of the currently played game.
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
/*	swing: function (target) {
		var game = this.game;
		target = $(target);

		this.swings++; //Log every swing.

		if (target.hasClass('active')) {// If the swing was a hit...
			this.hits++;
			this.score = this.score + game.levelData[game.currentLevel].pointValue; //Add to the score depend on level's point value.
			$('.player-' + this.id).text(this.score);
			console.log(this.score);
				//Make inactive for multiple hits, and allow hit styling
			target.removeClass('red-bg active').addClass('green-bg hit');
				//After a half second reset defaults
			setTimeout(function () {
				target.removeClass('green-bg hit').addClass('passive');//Change color for a moment, and then make cell passive again
			}, 500);
		}

	},*/
	getAccuracy: function () {
		return this.hits / this.swings;
	},

	getCompletion: function () {
		//get max number of possible hits
		var maxPossible = 0;
		this.game.levelData.forEach(function (currentObject) { //levelData is an array of objects
			console.log(currentObject);
			maxPossible += currentObject.maxHitPieces;
		});

		return this.hits / maxPossible;
	}
};


var john = new Player(Game, 'john');

john.score = 100;
john.hits = 14;
john.swings = 17;

var wendy = new Player(Game, 'wendy');

wendy.score = 102;
wendy.hits = 14;
wendy.swings = 17;

var peter = new Player(Game, 'peter');

peter.score = 100;
peter.hits = 14;
peter.swings = 17;

var nana = new Player(Game, 'nana');

nana.score = 130;
nana.hits = 14;
nana.swings = 17;

Game.playerList= [john, wendy, peter, nana];

Game.recap()
