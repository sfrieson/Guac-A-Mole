var display = {};
$(function(){
  //Right side of the board
  display.map = $('<section>').attr('id',"map");
  display.body = $('body');
})


//Title Screen
display.title = function () {
	var title = $('<section>').attr('id',"title").addClass("full-screen yellow-bg");
	var text = $('<h1>').addClass("green").text('Guac-a-Mole');
	title.append(text);
	display.body.append(title);

	text.animate({fontSize: "18vh"}, 700, 'swing',
		function () {setTimeout(function(){display.getNumberOfPlayers(function(){
      title.animate({left: "-200vw"}, 400, 'swing', function () {title.remove();} );
    });}, 1000);}
	);
};

//Gets input on number of players and their names
display.getNumberOfPlayers = function (hideTitle) {
	//Set-up the page
	var getPlayers = $('<section>').attr('id',"get-players");
	var numberPicker = $('<div>').addClass("full-screen green-bg");
  
	numberPicker.append( $('<h1>').text("How many players?") );
	for (i = 1; i <= game.maxPlayers; i++) {
		numberPicker.append( $('<button>').addClass('red-bg').text(i) );
	}

	getPlayers.append( numberPicker );
	display.body.prepend(getPlayers); //Add behind title
  hideTitle(); //Animate title off screen and remove it.

	getPlayers.on('click', 'button', function(e){
    display.getNamesofPlayers(numberPicker, e.target.innerText);
  });
};

display.getNamesofPlayers = function(getNames, numOfPlayers) {
  $('h1').text("Player names:");
  $('button').remove();
  var form = $('<form>');

  for (var i = 1; i <= numOfPlayers; i++) {
    var formInput = $('<div>').addClass("player-input-section").append(
      $('<label>').attr('for', 'Player ' + i).html( $('<h2>').text('Player ' + i) ),
      $('<input>').attr('type', 'text')
    );
    form.append(formInput);
    // if(i === 0); formInput.focus();
  }
  form.append(
    $('<button>').attr('id',"play").addClass("button orange-bg").text("Let\'s go!")
  );

  getNames.append(form);
  form.on("click", "button", function (e) {
    e.preventDefault();
    game.makePlayers($('input'));
    display.run();
  });
};

//Runs the game
display.run = function () {//The flow for a game.  Called once per game.
  //Initialize document.body This all only happens once.
  display.body.empty() //Remove Act I title screens or previous game (play again).
  .append(
    $('<main>').append( $('<div>').attr('id',"game") )
  );

  game.currentPlayer = game.playerList[0];

  display.setScoreboard();//Set scoreboard
  $('.player-' + game.currentPlayer.id).parent().addClass('dorange'); //Highlights the first player up (only necessary first time)

  game.nextLevel();
};

//Sets up the board for the beginning of each level
display.setBoard = function (level) {
  var	grid = $('<div>').attr('id', 'grid-' + level.grid); //make the grid div with size setting in ID
  for (var i = 0; i < level.cells.length; i++) {
    cell = level.cells[i];
    cell.view = $('<div>').addClass('passive cell-' + level.grid);
    grid.append( cell.view ); //Adds one new piece to the grid
  }

  grid.mousedown(game.currentPlayer.swing.bind(game.currentPlayer));

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

display.preLevel = function (level) {
  this.scoreboardTitle.text("Level " + level.id);
  console.log("Now for level " + level.id);
  console.log("Now playing..." + game.currentPlayer.name);

  this.setBoard(level); //Set playing board
  this.countdown(); //Starts level countdown
};

//Sets a cell to be active to hit for limited time
display.showHitPiece = function (cell) {
  cell.img = $('<img>').attr('src', "images/avocado.gif?" + Date.now());
	cell.view.removeClass('passive').addClass('active').append(cell.img);

	setTimeout(function () {
		display.hideHitPiece(cell);
	}, game.currentLevel.showLength);//length of time cell is active before it becomes passive again
};

display.hideHitPiece = function (cell) {

  cell.view.removeClass('active red-bg').addClass('passive');
  cell.img.remove();
  cell.makePassive();
};

display.successfulHit = function(target) {
  $('.player-' + game.currentPlayer.id).text(game.currentPlayer.score);
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
