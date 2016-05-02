var display = {};

//Right side of the board
display.map = $('<section>').attr('id',"map");

//Title Screen
display.title = function () {
  var body = $('body');
	var title = $('<section>').attr('id',"title").addClass("full-screen yellow-bg");
	var text = $('<h1>').addClass("green").text('Guac-a-Mole');
	title.append(text);
	body.append(title);

	text.animate({fontSize: "18vh"}, 700, 'swing',
		function () {setTimeout(function(){display.getNumberOfPlayers(body, title);}, 1000);}
	);
};

//Gets input on number of players and their names
display.getNumberOfPlayers = function (body, titlePage) {
	//Set-up the page
	var getPlayers = $('<section>').attr('id',"get-players");

	var numberPicker = $('<div>').addClass("full-screen green-bg");
	numberPicker.append( $('<h1>').text("How many players?") );
	for (i = 1; i <= game.maxPlayers; i++) {
		numberPicker.append( $('<button>').addClass('red-bg').text(i) );
	}

	getPlayers.append( numberPicker );
	body.prepend(getPlayers); //Add behind title
	title.animate({left: "-200vw"}, 400, 'swing', function () {this.remove();} ); //Animate title off screen and remove it.

	getPlayers.on('click', 'button', function(e){ display.getNames(e.target.innerText); });
};

display.getNames = function(numOfPlayers) {
  $('h1').text("Player names:");
  $('button').remove();
  var form = $('<form>'),
  getNames = $('section#get-players div.green-bg');

  for (var i = 1; i <= numOfPlayers; i++) {
    var formInput = $('<div>').addClass("player-input-section");
    formInput.append(
      $('<label>').attr('for', 'Player ' + i).html($('<h2>').text('Player ' + i)),
      $('<input>').attr('type', 'text')
    );
    form.append(formInput);
    if(i === 0); formInput.focus();
  }
  form.append(
    $('<button>').attr('id',"play").addClass("button orange-bg").text("Let\'s go!")
  );
  getNames.append(form);
  form.submit(function () {
    game.makePlayers($('input'));
    display.run();
  });
};

//Runs the game
display.run = function () {//The flow for a game.  Called once per game.
  //Initialize document.body This all only happens once.
  $('body').empty() //Remove Act I title screens or previous game (play again).
  .append(
    $('<main>').append( $('<div>').attr('id',"game") )
  );
  //TODO: Clean this section up a bit.
  game.currentPlayer = game.playerList[0];
  display.setScoreboard();//Set scoreboard
  $('.player-' + game.currentPlayer.id).parent().addClass('dorange'); //Highlights the first player up (only necessary first time)
  display.setBoard(game.currentLevel); //Set playing board
  display.countdown(); //Starts level countdown
};

//Sets up the board for the beginning of each level
display.setBoard = function (level) {
  var	grid = $('<div>').attr('id', 'grid-' + level.grid); //make the grid div with size setting in ID

  for (var i = 0; i < level.pieces; i++) {
    grid.append( $('<div>').addClass('passive cell-' + level.grid) ); //Adds one new piece to the grid
  }

  grid.mousedown(game.currentPlayer.swing);

  this.map.html(grid); //replace with the grid
  $('#game').append(this.map);
};

//Sets up the scoreboard at the beginning of the game.
display.setScoreboard = function () {
  var scoreboard = $('<div>').attr('id',"scoreboard");
  this.scoreboardTitle = $('<h2>').attr('id',"scoreboard-title").text("Level " + (game.currentLevel.id));
  scoreboard.append(this.scoreboardTitle);

  game.playerList.forEach (function(player, i) {
  	var namePlace = $('<div>').addClass('player');
  	namePlace.append( $('<h3>').addClass('player-name').text(player.name),
  	 $('<div>').addClass('score player-' + player.id).text(0)
    );

  	scoreboard.append(namePlace);
  });

  $('#game').append(scoreboard);
};

//Countdowns before each round
display.countdown = function () {
	var popUp = $('<div>').addClass("pop-up"); //Covers playing board
	popUp.append( $('<h2>').text("Are you ready " + game.currentPlayer.name + "?") );
	this.map.prepend(popUp); //Prepend to make sure it is at the top of the flow and covers everything

	function count() { //changes the number every second

		var number = $('<div>').attr('id',"countdown");
		popUp.append(number);
		var i = 3;
		var counter = setInterval(function () {
      if (i === 0) {
				clearInterval(counter);
				popUp.remove();
				game.start();
			}

			number.text(i--).css('opacity', 1);
			number.animate({opacity: 0}, 600);
		}, 1000);
	}

	setTimeout(count, 1500); //Does this all after seeing the new screen for a moment
};

display.changePlayer = function(newPlayer) {
  $('.dorange').removeClass('dorange'); //Un-highlight previous player
  $('.player-' + newPlayer.id).parent().addClass('dorange'); //Highlight next player

  if (newPlayer.id === 0) { //When we're back to the top of the player list...
		return game.nextLevel();
	}

  console.log("Now playing..." + newPlayer.name);
	this.countdown(); //(After if...) Otherwise, start up the game for the new player.
};

display.startLevel = function (level) {
  this.scoreboardTitle.text("Level " + level.id);
  console.log("Now for level " + level.id);
  console.log("Now playing..." + game.currentPlayer.name);
  this.setBoard(level); //(After if...) Otherwise, swap out the grid for the new level.
  this.countdown(); //Start up the next round.
};

//Sets a cell to be active to hit for limited time
display.showHitPiece = function (cell) {
	var image = $('<img>').attr('src', "images/avocado.gif?" + Date.now());
	cell.removeClass('passive').addClass('active').append(image); //Change state of cell to .active for hit.

	setTimeout(function () {  //length of time cell is active before it becomes passive again
		cell.removeClass('active red-bg').addClass('passive');
		image.remove();
	}, game.currentLevel.showLength);//Grabs the length of time piece is shown for this level.
};

display.successfulHit = function(target) {
  $('.player-' + game.currentPlayer.id).text(game.currentPlayer.score);
  console.log(game.currentPlayer.score);
  //Make inactive to avoid multiple hits, and allow hit styling
  //Change color for a moment, and then make cell passive again
  target.removeClass('active').text("").addClass('hit');
  //After a half second reset defaults
  setTimeout(function () {
    target.removeClass('hit').addClass('passive');
  }, 500);
};

display.recap = function (playerList) {
	var fullScreen = $('<div>').addClass("full-screen orange-bg").css('top', '200vh');

	fullScreen.append($('<h1>').text('Results...'));
  $('body').append(fullScreen); 
	fullScreen.animate({top: "0vh"}, 600);

  //Shows all players and their game scores
	playerList.forEach(function(player, i) {
		var rapSheet = $('<section>').addClass('rap-sheet')
    .css({ width: 100 / playerList.length + "%" }) //Makes sure all players fit across page
		.append(player.name, playerList.score,
      $('<div>').text('Accuracy bonus: ' + player.accuracy), $('<div>').text('Completion bonus: ' + player.completion),
      $('<div>').addClass('final-score').html('Final Score:<br><strong> ' + player.finalScore + ' </strong>')
    );

		if (game.winner === player) rapSheet.addClass('winner');

    fullScreen.append(rapSheet);
	});
};
