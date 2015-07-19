var game = new Phaser.Game(1044, 576, Phaser.Auto, 'gameBox'),
    keyBinds = new KeyBindings(game);

var Global = {
	'server': null,
	'client': null,
	'levels': [
		'level_0',
		'level_1',
		'level_2',
		'level_3',
		'level_4',
		'level_5'
	]
};
	
function StartGame() {
	
	game.state.add('home_menu', new HomeMenu());

	for(var i = 0; i < Global.levels.length; i++) {
		game.state.add(Global.levels[i], new Level(Global.levels[i]));
	}

	// start at the menu
	game.state.start("home_menu");
}

// get a file
function Get(url) {
	var res = "";
	$.ajax({
		url: url,
		success: function(data) {
			res = data;
		},
		async: false
	});
	return res;
}

function SelectLevel(level) {
	game.state.start(level);
}


$(document).on("keydown", function (e) {
	if (e.which != 116) { // we want to refresh often, so no preventing the F5 key!
		e.preventDefault();
	}
	if(e.which){
		
	}
});