var game = new Phaser.Game(1044, 576, Phaser.Auto, 'gameBox'),
    keyBinds = new KeyBindings(game),
    peer = null;

var Global = {
	'server': null,
	'client': null,
	'levels': [
		'level_0',
		'level_1',
		//'george', //for testing purposes :P
		'level_2',
		'level_3',
		'level_4',
		'level_5'
	],
	// a list of random names to choose from if the user doesn't pass in a username
	'randomNames': [
		'Bob',
		'Joe',
		'Some Dude',
		'Icecream Man',
		'Joe The Brotato',
		'Broman',
		'Connor',
		'Paul',
		'Andrew',
		'Steve',
		'Alex',
		'Richard',
		'Philip'
	]
};
	
function StartGame() {
	
	var username = localStorage.getItem('username');
	
	if(username == null) {
		username = window.prompt("Username");
	
		// if they didn't give us a username we'll choose a random one for them from a list!
		// we also append a random number to the end just incase someone else has that username
		if(username == null || username == '') {
			username = Global.randomNames[Math.floor(Math.random() * Global.randomNames.length)] + ' ' + Utils.genRandString(2);
		}
		
		localStorage.setItem('username', username);
	}
	
	console.log(username);
	
	game.state.add('home_menu', new HomeMenu());

	// start at the menu
	game.state.start("home_menu");
	
	peer = new Peer({key: '55sj0os1x512a9k9'});
	
	peer.on('open', function(id){
		var res = Get('/api/register?id=' + id + '&username=' + username);
		console.log(res);
	});
	
	peer.on('connection', function(conn){
		
		console.log('connection!');
		
		var otherCharacter = game.state.getCurrentState().getObjectById('camper_1');
		otherCharacter.sync = false;
		otherCharacter.obj.body.moves = false;
		
		// we should be receiving a position from the other peer
		conn.on('data', OnPeerData);
		
		// send our worlds state 30 times a second
		StartPeerSync(conn);
		
	});
}

function OnPeerData(data){
	var state = game.state.getCurrentState();
	
	// this will ensure that this is only called on the Level state
	if(state.decodeState) {
		state.decodeState(JSON.parse(data));
	}
}

function StartPeerSync(conn) {
	window.setInterval(function(){
		var state = game.state.getCurrentState();
		
		// this will ensure that this is only called on the Level state
		if(state.encodeState) {
			conn.send(JSON.stringify(state.encodeState()));
		}
	}, 1000 / 30);
}

function Connect(id) {
	var otherCharacter = game.state.getCurrentState().getObjectById('camper_0');
	otherCharacter.sync = false;
	otherCharacter.obj.body.moves = false;
	
	var conn = peer.connect(id);
	conn.on('data', OnPeerData);
	StartPeerSync(conn);
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
});