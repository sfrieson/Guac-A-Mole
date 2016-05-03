//game constructor function
var Game = function () {
	this.playerList = []; //Link to each player's object. Populated by Game.getPlayers()
	this.currentPlayer = null; //this.playerList[0]; //Holds an instance of Player.
	this.currentLevel = this.levelData[0]; //Holds the index of levelData for level being played.  Initialized for first level.
	this.maxPlayers = 4;
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
			setTimeout(game.currentLevel.nextPlayer.bind(game), 3000); //Pauses before going to next player
		}
		game.currentLevel.randomPassiveCell(); //Each interval pick a hit piece
		hitPiecesRemaining--;
	}, this.currentLevel.speedFactor); //How often pieces show on this level
};

// Creates players and populates the playerList[];
Game.prototype.makePlayers = function ($playerInput) {
	$playerInput.each(function(i, input){
		this.playerList.push(
			new Player(input.value || "Player " + (i+1))//name or default name
		);
	}.bind(this));
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

//Data for how many pieces go on each level and how they should be styled.
Game.prototype.levelData = [
	{id: 1, pieces: 6, gridWidth: 3, gridHeight: 2, speedFactor: 1050, showLength: 2000, maxHitPieces: 5, pointValue: 1}, //Level 1
	{id: 2, pieces: 9, gridWidth: 3, gridHeight: 3, speedFactor: 450, showLength: 1000, maxHitPieces: 15, pointValue: 5}, //Level 2
	{id: 3, pieces: 12, gridWidth: 4, gridHeight: 3, speedFactor: 350, showLength: 700, maxHitPieces: 25, pointValue: 10} //Level 3
];

//Changes the level after each player has played it
Game.prototype.nextLevel = (function () {
	var levelIndex = 0;
	return function(){
		if (levelIndex === this.levelData.length) this.results(); //On to the end of the game
	  else {
			display.preLevel( new this.Level( this, game.levelData[levelIndex++] ));
		}
	};
})();



// Constructor for each level of the game.
var Level = Game.prototype.Level = function(game, opt) {
	game.currentLevel = this; //Current level autamtically set to this upon creation
	this.id = opt.id;
	this.pieces = opt.pieces;
	this.gridHeight = opt.gridHeight;
	this.gridWidth = opt.gridWidth;
	this.grid = opt.gridWidth + "x" + opt.gridHeight;
	this.speedFactor = opt.speedFactor;
	this.showLength = opt.showLength;
	this.maxHitPieces = opt.maxHitPieces;
	this.pointValue = opt.pointValue;

	this.cells = [];
	this.passiveCells = [];

	//Create Cells for this level
	for(var x = 0; x < this.gridWidth; x++){
		for(var y = 0; y < this.gridHeight; y++){
			new this.Cell(this, x, y);
		}
	}
};

//Sets a cell to be active to hit for limited time
Level.prototype.randomPassiveCell = function () {
	var index = Math.floor(  Math.random() * game.currentLevel.passiveCells.length );
	display.showHitPiece(game.currentLevel.passiveCells.splice(index, 1)[0]);
};

	//Changes the player before the start of each round
Level.prototype.nextPlayer = (function () {
	var currentIndex = 0;
	return function(){
		//Iterate through the players but only as high as the number of players
		currentIndex = (currentIndex + 1) % this.playerList.length;
		display.changePlayer(this.currentPlayer = this.playerList[currentIndex]);
	};
})();



var Cell = Level.prototype.Cell = function(level, x, y){
	level.cells.push(this);
	level.passiveCells.push(this);
	this.x=x;
	this.y=y;
};

Cell.prototype.makePassive = function () {
	game.currentLevel.passiveCells.push(this);
};
