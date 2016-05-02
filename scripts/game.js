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
		return (this.currentPlayer = this.playerList[currentIndex]);
	};
})();

//Sets a cell to be active to hit for limited time
Game.prototype.randomPassiveCell = function () {
	var $passiveCells = $('.passive');
	var randCell = $passiveCells.eq (parseInt(Math.random() * $passiveCells.length, 10) );
	//Selects random number possible for available .passive divs
	return randCell;
};

Game.prototype.hit = function (target) {
	// console.log("Hit " + this.hits);
	this.currentPlayer.score += this.currentLevel.pointValue;
};

//Starts the round
Game.prototype.start = function () {
	console.log("Start of round.");
	var	hitPiecesRemaining = this.currentLevel.maxHitPieces; //How many pieces show on this level

	//Starts game action
	var interval = setInterval(function () { //Like a for loop
		if (!hitPiecesRemaining) {
			clearInterval(interval);//Stop loop when no more pieces are remaining
			console.log("End of round.");
			return setTimeout(function () {
				display.changePlayer(); //Pauses before we go to the next player

			}, 3000);
		}

		display.showHitPiece(); //Each interval makes another hit piece
		hitPiecesRemaining--;
	}.bind(this), this.currentLevel.speedFactor); //How often pieces show on this level
};



//Changes the level after each player has played it
Game.prototype.changeLevel = (function () {
	var levelIndex = 0;
	return function(){
		if (++levelIndex === this.levelData.length) { //When we've gone through all the levels...
	  	return this.results(); //On to the end of the game
	  } else {
			var newLevel = this.currentLevel = this.levelData[levelIndex];
			display.startLevel(newLevel);
		}
	};
})();

// Creates players and populates the playerList[];
Game.prototype.makePlayers = function (playerInput) {
	for (var i = 0; i < (playerInput.length - 1); i++) { //The last input is the submit button
		var name = playerInput[i].value ||
		"Player " + (i + 1);
		var player = new Player(name);
		console.log(player);
		this.playerList.push(player);
	}
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
		}
	});

	return this.playerList;
};

Game.prototype.preGame = function () {
	//Title Screen
	var title = $('<section id="title" class="full-screen yellow-bg">');
	var text = $('<h1 class="green">').text('Guac-a-Mole');
	title.append(text);
	$('body').append(title);
	text.animate({fontSize: "18vh"}, 700, 'swing',
		function () {
			// var game = new Game(); //Create the game
			setTimeout(function () {this.playerScreen(); }.bind(this), 1000); //Go to player creation
		}.bind(this)
	);
};

//Gets input on number of players and their names
Game.prototype.playerScreen = function () {
	//Set-up the page
	var getPlayers = $('<section>').attr('id',"get-players");


	var numberPicker = $('<div>').addClass("full-screen green-bg");
	numberPicker.append( $('<h1>').text("How many players?") );
	for (i = 1; i <= this.maxPlayers; i++) {
		numberPicker.append( $('<button>').addClass('red-bg').text(i) );
	}

	getPlayers.append( numberPicker );
	$('body').prepend(getPlayers);

	$('#title').animate({left: "-200vw"}, 400, 'swing', function () {this.remove();} ); //Animate title off screen and remove it.

	getPlayers.on('click', 'button', function (e) {

		$('h1').text("Player names:");
		$('button').remove();
		var form = $('<form>');
		getPlayers.append(form);
		for (var i = 1; i <= e.target.innerText; i++) {

			var formInput = $('<div>').addClass("player-input-section");
			formInput.append(
				$('<label>').attr('for', 'Player ' + i).html($('<h2>').text('Player ' + i)),
				$('<input>').attr('type', 'text')
			);
			form.append(formInput);
			if(i===0); formInput.focus();
		}
		form.append(
			$('<input>').attr('type',"submit").attr('id',"play").addClass("button orange-bg").attr('value',"Let\'s go!")
		);
		form.submit(function (e) {
			e.preventDefault();
			this.makePlayers($('input'));
			display.run();
		}.bind(this));
	}.bind(this));
};
