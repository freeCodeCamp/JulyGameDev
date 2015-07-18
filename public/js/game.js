var game = new Phaser.Game(1044, 576, Phaser.Auto, document.getElementById('gameBox')),
    keyBinds = new KeyBindings(game);

$(document).on("keydown", function (e) {
	if (e.which != 116) { // we want to refresh often, so no preventing the F5 key!
		e.preventDefault();
	}
});

/*
//singleplayer scoreboard
var scoreBoard = function (player1) {
	this.player1 = player1;
	this.player1Score = 0;
}

//multiplayer scoreboards
var scoreBoards = function (player1, player2) {
	this.player1 = player1;
	this.player2 = player2;
	this.player1Score = 0;
	this.player2Score = 0;
}

var updateScore = function (player) {
	if(scoreBoard.player1 !== null){
		scoreBoard.player1Score = scoreBoard.player1Score + 10;
	}
	else if(scoreBoards.player1 === player) {
		scoreBoards.player1Score = scoreBoards.player1Score + 10;
	}
	else if(scoreBoards.player2 === player) {
		scoreBoards.player2Score = scoreBoardsPlayer2Score + 10;
	}
	else {
		return("unable to find player for score, you screwed up!")
	}
}
*/

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

function Level(level) {
	
	// Objects that are created throughout the game
	this.Objects = {
		poops: [],
		boxes: [],
		money: [],
		camper: null,
		hotdog: null,
		tent: null,
		waitupmsg: null,
		map: null,
		layer: null
	};
	
	// Various custom states of the objects
	this.State = {
		Player: {
			score: 0
		},
		Poop: {
			nextPoopTimeRemaining: Math.floor((Math.random() * 40) + 20) * 1000 // Initial poop
		}
	};
	
	// Loaded on a per level basis
	this.Settings = Get('/levels/' + level + '.json');
};

Level.prototype = {
	
	// Movable box
	spawnMovableBox: function(level, x, y) {
		var newBox = game.add.sprite(x, y, 'boxmovable');
		game.physics.arcade.enable(newBox);
		newBox.body.gravity.y = 500;
		newBox.body.drag.setTo(75);
		level.Objects.boxes.push(newBox);
	},
	
	// Money!!!!
	spawnMoney: function(level, x, y) {
		var newMoney = game.add.sprite(x, y, 'moneyz');
		game.physics.arcade.enable(newMoney);
		level.Objects.money.push(newMoney);
	},
	
	preload: function (){
        game.load.tilemap('map', 'assets/' + this.Settings.mapFile, null, Phaser.Tilemap.TILED_JSON);
        game.load.spritesheet('camper', 'assets/camper.png', 58, 88, 4);
        game.load.spritesheet('poop', 'assets/poop.png', 16, 16, 2);
        game.load.spritesheet('hotdog', 'assets/hotdog.png', 52, 29, 2);
        game.load.image('level-x32', 'assets/level-x32.png');
        game.load.image('tent', 'assets/tent.png');
        game.load.image('flower', 'assets/flower.png');
        game.load.image('waitup', 'assets/waitup.png');
        game.load.image('tree', 'assets/tree.png');
        game.load.image('boxmovable', 'assets/boxmovable.png');
        game.load.image('moneyz', 'assets/moneyz.png');
	},
	
	create: function () {
	
	    game.stage.backgroundColor = '#edfffe';
	    
	    //Starts physics
	    game.physics.startSystem(Phaser.Physics.ARCADE);
	    
	   	// Trees
	    game.add.sprite(600, 320, 'tree');
	    
	   	// Create Tent
	    this.Objects.tent = game.add.sprite(2815, 232, 'tent');
	    game.physics.arcade.enable(this.Objects.tent);
	    this.Objects.tent.scale.x = 2.5;
	    this.Objects.tent.scale.y = 2.5;
	    
	    //Create player (sprite)
	    this.Objects.camper = game.add.sprite(this.Settings.Player.spawnPoint.x, this.Settings.Player.spawnPoint.y, 'camper');
	    
	    //Enable Physics for player
	    game.physics.arcade.enable(this.Objects.camper);
	    this.Objects.camper.body.gravity.y = this.Settings.Player.gravity;
	    
	    // Set pivot point of player to the center of the sprite
	    this.Objects.camper.anchor.setTo(.5, .5);
	    this.Objects.camper.animations.add('idle', [0, 3]);
	    this.Objects.camper.animations.add('walk', [0, 2]);
	    this.Objects.camper.animations.add('jumping', [2]);
	    
	    //Creates the map
	    this.Objects.map = game.add.tilemap('map');
	    this.Objects.map.addTilesetImage('level-x32');
	    
	    $.each(this.Objects.map.layers[0]['data'], function(i, e){
	    	$.each(e, function(ii, ee){
	    		
	    	});
	    });
	    
	    //Set collisions
	    this.Objects.map.setCollisionBetween(1, 2);
	    
	    //Intializes the world.
	    this.Objects.layer = this.Objects.map.createLayer('World');
	    this.Objects.layer.resizeWorld();
	    
	    // Camera center follows player
	    game.camera.follow(this.Objects.camper);
	    
	    // Create the dog (follower)
	    this.Objects.hotdog = game.add.sprite(300, 550, 'hotdog');
	    game.physics.arcade.enable(this.Objects.hotdog);
	    this.Objects.hotdog.animations.add('walk');
	    this.Objects.hotdog.body.gravity.y = 500;
	    this.Objects.hotdog.anchor.setTo(.5, .5);
	    
	    // Dog tells you to wait for him
	    this.Objects.waitupmsg = game.add.sprite(300, 550, 'waitup');
	    this.Objects.waitupmsg.visible = false;
	    game.physics.arcade.enable(this.Objects.waitupmsg);
	    
	    // Flowers
	    for (var i = 0; i < 10; ++i) {
	    	game.add.sprite(300 + (i * 110 ) + Math.floor(Math.random() * (50 - 10)) + 10, 545, 'flower');
	    }
	    
	    // Spawn Boxes
	    this.spawnMovableBox(this, 1550, 300);
	    this.spawnMovableBox(this, 1650, 300);
	    
	    // Spawn Money
	    this.spawnMoney(this, 1100, 500);
	    this.spawnMoney(this, 1200, 500);
	    this.spawnMoney(this, 1300, 500);
	    
	},
	
	update: function () {
		var self = this;
		
		game.physics.arcade.collide(this.Objects.camper, this.Objects.layer);
		game.physics.arcade.collide(this.Objects.hotdog, this.Objects.layer);

		this.Objects.money.forEach(function (money) {
			if (game.physics.arcade.collide(self.Objects.camper, money)) {
				money.destroy();
				self.State.Player.score += 100;
			}
		});

		var onBox = false, boxArray = this.Objects.boxes;

		boxArray.forEach(function (box) {

			boxArray.forEach(function (box2) {
				if(box !== box2) game.physics.arcade.collide(box, box2);
			});
		
			game.physics.arcade.collide(box, self.Objects.layer);
			var res = game.physics.arcade.collide(self.Objects.camper, box);
			
			if(res && box.body.y >= (self.Objects.camper.body.y + self.Objects.camper.body.height)) {
				onBox = true;
			}
		
		});
		
		this.Objects.camper.body.velocity.x = 0;
		game.physics.arcade.moveToXY(
			this.Objects.waitupmsg,
			this.Objects.hotdog.body.x, 
			this.Objects.hotdog.body.y - this.Objects.waitupmsg.body.height, 
			this.Settings.Dog.horizontalMoveSpeed
		);
		
		//Player controls
		if (keyBinds.moveBackwards()) {
			this.Objects.camper.body.velocity.x = -this.Settings.Player.horizontalMoveSpeed;
			this.Objects.camper.scale.x = -1;
			this.Objects.camper.animations.play('walk', this.Settings.Player.walkAnimationSpeed, true);
		}
		else if (keyBinds.moveForwards()) {
			this.Objects.camper.body.velocity.x = this.Settings.Player.horizontalMoveSpeed;
			this.Objects.camper.scale.x = 1;
			this.Objects.camper.animations.play('walk', this.Settings.Player.walkAnimationSpeed, true);
		}
		else {
			this.Objects.camper.animations.play('idle', this.Settings.Player.idleAnimationSpeed, true);
		}
		
		if (keyBinds.jump() && (this.Objects.camper.body.onFloor() || onBox)) {
			this.Objects.camper.body.velocity.y = -this.Settings.Player.verticalMoveSpeed;
		}

		//Doggy Logic :)
		/*Meow Wuff?*/
		
		var x_diff = Phaser.Math.difference(this.Objects.hotdog.body.x, this.Objects.camper.body.x);
		var y_diff = Phaser.Math.difference(this.Objects.hotdog.body.y, this.Objects.camper.body.y);
		
		if (x_diff > 50) {
			this.Objects.hotdog.animations.play('walk', 5, true);
			var dogLeftOfCamper = this.Objects.hotdog.body.x < this.Objects.camper.body.x;
			this.Objects.hotdog.body.velocity.x = dogLeftOfCamper ? 100 : -100;
			this.Objects.hotdog.scale.x = dogLeftOfCamper ? 1 : -1;
		} else {
			this.Objects.hotdog.animations.stop(true);
			this.Objects.hotdog.body.velocity.x = 0;
		}
		
		if (this.Objects.hotdog.body.onWall()) {
			this.Objects.hotdog.body.velocity.y = -100;
		}
		
		// If you move away from the dog too far, it will yell to you for you to wait for him!
		this.Objects.waitupmsg.visible = x_diff > 175;
		
		// Dog poop logic
		while (this.Objects.poops.length > 20) {
			var poop = this.Objects.poops.pop();
			poop.destroy(); // limit the number of poops in the map
		}
		this.Objects.poops.forEach(function (poop) {
			game.physics.arcade.collide(poop, self.Objects.layer);
		});
		if (this.State.Poop.nextPoopTimeRemaining <= 0) {
			var newPoop = game.add.sprite(this.Objects.hotdog.body.x + (this.Objects.hotdog.body.width / 2.0), this.Objects.hotdog.body.y + this.Objects.hotdog.body.height - 15, 'poop');
			newPoop.animations.add('stink');
			newPoop.animations.play('stink', 5, true);
			// poop between 60 and 10 seconds at random
			this.State.Poop.nextPoopTimeRemaining = 1000 * Math.floor((
				Math.random() * this.Settings.Poop.spawnTimeRange.max) + 
				this.Settings.Poop.spawnTimeRange.min
			);
			this.Objects.poops.push(newPoop);
			game.physics.arcade.enable(newPoop);
	    	newPoop.body.gravity.y = 250;
		}
		else {
			this.State.Poop.nextPoopTimeRemaining -= game.time.elapsed;
		}
		
		if (Phaser.Math.difference(this.Objects.camper.body.x, this.Objects.tent.body.x) <= 50) {
			var lvlComp = game.add.text(430, 288, "Level Complete!", {font:"32px Arial", fill: "#000", align: "center"});
			lvlComp.fixedToCamera = true;
			lvlComp.cameraOffset.setTo(430, 288);
			
			setTimeout(function(){
				game.state.start("level_1");
			}, 2000);
		}

	}
};

// load some levels
game.state.add("level_0", new Level("level_0"));
game.state.add("level_1", new Level("level_1"));

// start at level_0
game.state.start("level_0");
