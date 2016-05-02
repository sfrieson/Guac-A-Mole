//game constructor function
var Game = function () {
	this.playerList = []; //Link to each player's object. Populated by Game.getPlayers()
	this.currentPlayer = null; //this.playerList[0]; //Holds an instance of Player.
	this.currentLevel = this.levelData[0]; //Holds the index of levelData for level being played.  Initialized for first level.
	this.maxPlayers = 4;
};

//Data for how many pieces go on each level and how they should be styled.
Game.prototype.levelData = [
	{id: 1, pieces: 6, grid: '3x2', speedFactor: 1050, showLength: 2000, maxHitPieces: 5, pointValue: 1}, //Level 1
	{id: 2, pieces: 9, grid: '3x3', speedFactor: 450, showLength: 1000, maxHitPieces: 15, pointValue: 5}, //Level 2
	{id: 3, pieces: 12, grid: '4x3', speedFactor: 350, showLength: 700, maxHitPieces: 25, pointValue: 10} //Level 3
];

	//Changes the player before the start of each round
Game.prototype.nextPlayer = (function () {
	var currentIndex = 0;
	return function(){
		//Iterate through the players but only as high as the number of players
		currentIndex = (currentIndex + 1) % this.playerList.length;
		display.changePlayer(this.currentPlayer = this.playerList[currentIndex]);
	};
})();

//Changes the level after each player has played it
Game.prototype.nextLevel = (function () {
	var levelIndex = 0;
	return function(){
		if (++levelIndex === this.levelData.length) this.results(); //On to the end of the game
	  else {
			display.startLevel( this.currentLevel = this.levelData[levelIndex] );
		}
	};
})();

//Sets a cell to be active to hit for limited time
Game.prototype.randomPassiveCell = function () {
	var randCell = $passiveCells.eq( Math.floor(  Math.random() * $('.passive').length  ) );
	display.showHitPiece(randCell);
};

Game.prototype.hit = function (target) {
	this.currentPlayer.score += this.currentLevel.pointValue;
};

//Starts the round
Game.prototype.start = function () {
	var	hitPiecesRemaining = this.currentLevel.maxHitPieces; //How many pieces show on this level

	//Starts game action
	var interval = setInterval(function () { //Like a for loop
		if (!hitPiecesRemaining) {
			clearInterval(interval);//Stop loop when no more pieces are remaining
			setTimeout(game.nextPlayer, 3000); //Pauses before going to next player
		}
		game.randomPassiveCell(); //Each interval pick a hit piece
		hitPiecesRemaining--;
	}, this.currentLevel.speedFactor); //How often pieces show on this level
};

// Creates players and populates the playerList[];
Game.prototype.makePlayers = function (playerInput) {
	playerInput.forEach(function(input, i){
		this.playerlist.push(
			new Player(input.value || "Player " + (i+1))//name or default name
		);
	});
};

//Compiles how player(s) did at the end of game
Game.prototype.results = function () {
	this.playerList.forEach(function(player, i) {
		player.accuracy   = Math.floor(player.getAccuracy() * 50);
		player.completion = Math.floor(player.getCompletion() * 50);
		player.finalScore = player.score + player.accuracy + player.completion;

		//Compares totals
		if (!this.winner || player.finalScore > this.winner.finalScore) {
			this.winner = player;
			console.log("Winner:", this.winner);
		}
	}.bind(this));

	return display.recap(this.playerList);
};
