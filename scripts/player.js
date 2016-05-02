// Constructor is called by the game and takes an argument of the game to link them up
var Player = (function (){
	var id = -1;
	return function (name) { //game is scope of the currently played game.
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
Player.prototype.swing = function (e) {
	this.swings++; //Count every swing.
	console.log("Swing " + this.swings);

	if (e.target.hasAttribute('src')) {// If the swing was a hit (because they clicked an img that only shows for active divs)
		this.hits++;
		game.hit();
		display.successfulHit( $(e.target.parentElement) );
	}
};

	// Calculates the players accuracy
Player.prototype.getAccuracy = function () {
		return this.hits / this.swings;
	};

	// Calculates the percentage of hit pieces successfully hit
Player.prototype.getCompletion = function () {
	//get max number of possible hits
	var maxPossible = 0;
	game.levelData.forEach(function (currentObject) { //levelData is an array of objects
		maxPossible += currentObject.maxHitPieces;
	});

	return this.hits / maxPossible;
};
