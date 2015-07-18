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

function titleAndMenu() {
	this.Menu = [{text: "Play", top: 0, left: 200}, {text: "Select Level", top: 0, left: 125}, {text: "Controls", top: 0, left: 165}];
	this.Title = "Camper Survival";
	this.Clicked = false;
	this.currentMenu = "main";
	this.range = function(findBetween, start, finish) {
		if(findBetween >= start && findBetween <= finish){
			return true;
		}
		else{
			return false;
		}
	}
}

titleAndMenu.prototype = {
	preload: function() {
		
		// Stuff
		
	},
	create: function(){
		
		game.stage.backgroundColor = "#D0F5DF"; // ah that worked :p
		var leftmagicOffset = (game.width/2) - 250;
		var topMagicOffest = game.height/8.0;
		
		var title = game.add.text(leftmagicOffset+20,  topMagicOffest, this.Title, {font:"60px Arial", fill: "lightsalmon", align: "center"});
		
		var i = 0;
		this.renderedElements = this.Menu.map(function(elm){
			i++;
			return(game.add.text(leftmagicOffset+elm.left,  (topMagicOffest+(45*(i+1))-15)+elm.top, elm.text, {font:"40px Arial", fill: "white", align: "center"}));
		});
		
	},
	update: function(){
		if (this.currentMenu === "main") {
			if(!game.input.activePointer.isDown && this.Clicked) {
				this.Clicked = false;
			}
			
			if(game.input.activePointer.isDown && !this.Clicked) {
				this.Clicked = true;
				var po  = game.input.activePointer;
				var x = po.x;
				var y = po.y;

				/*There's no really clean way to modify these but as a rule of thumb each button is the position of the button before it + 45*/

				if (this.range(x, 395, 628) && this.range(y, 149, 189)) {
					console.log("Button1 clicked!");
					this.currentMenu = "null";
					game.state.start("level_0");
				} else if (this.range(x, 395, 628) && this.range(y, 189, 242)) {
					console.log("Button2 clicked!");
					this.currentMenu = "null";
				} else if (this.range(x, 395, 628) && this.range(y, 242, 282)) {
					console.log("Button3 clicked!");
					this.currentMenu = "null";
				}
			}
		}
	}
};

function Level(level) {
	
	// Objects that are created throughout the game
	this.Objects = {
		//poops: [],  --DEPRECATED--
		boxes: [],
		//money: [],  --DEPRECATED--
		campers: [],
		hotdog: null,
		tent: null,
		waitupmsg: null,
		map: null,
		layer: null
	};
	
	this.currentCamper = 0;
	this.changeTimer = new Date().getTime();
	
	// Various custom states of the objects
	/**this.State = {
		Player: {
			score: 0
		},
		Poop: {
			nextPoopTimeRemaining: Math.floor((Math.random() * 40) + 20) * 1000 // Initial poop
		} 
	}; --DEPRECATED--*/
	
	// Loaded on a per level basis
	this.Settings = Get('/levels/' + level + '.json');
};

Level.prototype = {
	
	// Kill/Death
	kill: function(index){
		this.Objects.campers[index].body.x = this.Settings.Player.spawnPoint.x;
		this.Objects.campers[index].body.y = this.Settings.Player.spawnPoint.y;
		// Other stuff
	},
	
	// Movable box
	spawnMovableBox: function(level, x, y) {
		var newBox = game.add.sprite(x, y, 'boxmovable');
		game.physics.arcade.enable(newBox);
		newBox.body.gravity.y = 1600;
		newBox.body.drag.setTo(165);
		level.Objects.boxes.push(newBox);
	},
	
	// Money!!!!
	/**spawnMoney: function(level, x, y) {
		var newMoney = game.add.sprite(x, y, 'moneyz');
		game.physics.arcade.enable(newMoney);
		level.Objects.money.push(newMoney);
	}, --DEPRECATED--*/
	
	spawnCamper: function (spawnX, spawnY, camperImageName) {
		var result = game.add.sprite(spawnX, spawnY, camperImageName);
		game.physics.arcade.enable(result);
		result.body.gravity.y = this.Settings.Player.gravity;
		result.anchor.setTo(.5, .5);
		result.animations.add('idle', [0, 0]);
		result.animations.add('walk', [0, 1]);
		//result.animations.add('jumping', [1, 1]); --DEPRECATED--
		return result;
	},
	
	preload: function (){
        game.load.tilemap('map', 'assets/' + this.Settings.mapFile, null, Phaser.Tilemap.TILED_JSON);
        game.load.spritesheet('camper', 'assets/camper.png', 56, 95, 2);
        //game.load.spritesheet('poop', 'assets/poop.png', 16, 16, 2);  --DEPRECATED--
        game.load.spritesheet('hotdog', 'assets/hotdog.png', 52, 29, 2);
        game.load.image('level-x32', 'assets/level-x32.png');
        game.load.image('tent', 'assets/tent.png');
        //game.load.image('flower', 'assets/flower.png');  --DEPRECATED--
        game.load.image('waitup', 'assets/waitup.png');
        //game.load.image('tree', 'assets/tree.png');  --DEPRECATED--
        game.load.image('boxmovable', 'assets/boxmovable.png');
        //game.load.image('moneyz', 'assets/moneyz.png'); --DEPRECATED--
	},
	
	create: function () {
	
	    game.stage.backgroundColor = '#edfffe';
	    
	    //Starts physics
	    game.physics.startSystem(Phaser.Physics.ARCADE);
	    
	   	// Trees
	   	// Trees may ahve to be added as two seperate sprites :p or there'll be more like weird bushes
	    //game.add.sprite(600, 320, 'tree');  --DEPRECATED--
	    
	   	// Create Tent
	    this.Objects.tent = game.add.sprite(2815, 232, 'tent');
	    game.physics.arcade.enable(this.Objects.tent);
	    this.Objects.tent.scale.x = 2.5;
	    this.Objects.tent.scale.y = 2.5;
	    
	    //Create player (sprite)
	    this.Objects.campers[0] = this.spawnCamper(this.Settings.Player.spawnPoint.x, this.Settings.Player.spawnPoint.y, 'camper');
	    this.Objects.campers[1] = this.spawnCamper(this.Settings.Player.spawnPoint.x + 100, this.Settings.Player.spawnPoint.y, 'camper');
	    
	    //Creates the map
	    this.Objects.map = game.add.tilemap('map');
	    this.Objects.map.addTilesetImage('level-x32');
	    /**$.each(this.Objects.map.layers[0]['data'], function(i, e){
	    	$.each(e, function(ii, ee){
	    		
	    	});
	    }); --REDUNDANT--*/
	    
	    //Set collisions
	    this.Objects.map.setCollisionBetween(1, 2);
	    console.log(this.Objects.map);
	    
	    //Intializes the world.
	    this.Objects.layer = this.Objects.map.createLayer('World');
	    this.Objects.layer.resizeWorld();
	    
	    // Camera center follows player
	    game.camera.follow(this.Objects.campers[0]);
	    
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
	    
	    //* Flowers
	    /*for (var i = 0; i < 10; ++i) {
	    	game.add.sprite(300 + (i * 110 ) + Math.floor(Math.random() * (50 - 10)) + 10, 545, 'flower');
	    } --DEPRECATED--*/
	    
	    // Spawn Boxes
	    this.spawnMovableBox(this, 1550, 300);

	    
	    // Spawn Money
	    /**this.spawnMoney(this, 1100, 500);
	    this.spawnMoney(this, 1200, 500);
	    this.spawnMoney(this, 1300, 500);
	    --DEPRECATED-- */
	},
	
	update: function () {
		var self = this;
		
		// Death by going outside of world
		this.Objects.campers.map(function(camper, index) {
			if (camper.body.x < 0 || camper.body.x > self.Objects.map.widthInPixels || camper.body.y < 0 || camper.body.y > self.Objects.map.heightInPixels) {
				self.kill();
			}
			
			// Tile colllision
			/* Logic fo working with collisions and collision data */
			// TODO: add destruction for boxes and the dog no the lava/spikes
			
			var tileX = Math.round(camper.body.x / 32);
			var tileY = Math.round(camper.body.y / 32);
			
			var tileBelow = self.Objects.map.getTile(tileX, tileY+3, self.Objects.layer, null);
			var tileBelowR = self.Objects.map.getTile(tileX+1, tileY+2, self.Objects.layer, null);
			var tileBelowL = self.Objects.map.getTile(tileX-1, tileY+2, self.Objects.layer, null);
			var tileColliding = self.Objects.map.getTile(tileX, tileY+2, self.Objects.layer, null);
			
			
			if(tileColliding != null){
				if (tileColliding.collisionCallbackContext.index === 3  || tileColliding.collisionCallbackContext.index === 4) {
					self.kill();
				}
			}
			
			/*if(tileBelowR != null){
				if ((tileBelowR.collisionCallbackContext.index === 3  || tileBelowR.collisionCallbackContext.index === 4) && tileBelow === null) {
					self.kill();
				}
			}
			
			if(tileBelowL != null){
				if ((tileBelowL.collisionCallbackContext.index === 3  || tileBelowL.collisionCallbackContext.index === 4) && tileBelow === null) {
					self.kill();
				
			}*/
			
			if(tileBelow != null){
				if (tileBelow.collisionCallbackContext.index === 3  || tileBelow.collisionCallbackContext.index === 4) {
					self.kill();
				}
			}
			
			game.physics.arcade.collide(camper, self.Objects.layer);
			
			camper.body.velocity.x = 0;
		});
		
		/**
		this.Objects.money.forEach(function (money) {
			if (game.physics.arcade.collide(self.Objects.camper, money)) {
				money.destroy();
				self.State.Player.score += 100;
			}
		});
		--DEPRECATED-- */

		game.physics.arcade.collide(this.Objects.hotdog, this.Objects.layer);
		
		var localCamper = self.Objects.campers[self.currentCamper];
		var otherCamper = self.Objects.campers[1 - self.currentCamper];
		
		
		var campersColliding = game.physics.arcade.collide(this.Objects.campers[0], this.Objects.campers[1]);
		var camperStandingOnCamper = false;
		if (campersColliding && otherCamper.body.y >= (localCamper.body.y + localCamper.body.height)) {
			camperStandingOnCamper = true;
		}
		

		var onBox = false, boxArray = this.Objects.boxes;

		boxArray.forEach(function (box) {

			boxArray.forEach(function (box2) {
				if(box !== box2) game.physics.arcade.collide(box, box2);
			});
		
			game.physics.arcade.collide(box, self.Objects.layer);
			
			var res = game.physics.arcade.collide(localCamper, box);
			
			if(res && box.body.y >= (localCamper.body.y + localCamper.body.height)) {
				onBox = true;
			}
		
		});
		
		
		
		
		game.physics.arcade.moveToXY(
			this.Objects.waitupmsg,
			this.Objects.hotdog.body.x, 
			this.Objects.hotdog.body.y - this.Objects.waitupmsg.body.height, 
			this.Settings.Dog.horizontalMoveSpeed
		);
		
		//Player controls
		
		if (keyBinds.switchPlayer()) {
			if (new Date().getTime() >= this.changeTimer) {
				this.changeTimer = new Date().getTime() + 500;
				if (this.currentCamper === 0) {
					this.currentCamper = 1;
					game.camera.follow(this.Objects.campers[1]);
				} else {
					this.currentCamper = 0;
					game.camera.follow(this.Objects.campers[0]);
				}
			}
		}
		
		// Singleplayer
		if (1 === 1) {
			var camper = this.Objects.campers[this.currentCamper];
			if (keyBinds.moveBackwards()) {
				camper.body.velocity.x = -this.Settings.Player.horizontalMoveSpeed;
				camper.scale.x = -1;
				camper.animations.play('walk', this.Settings.Player.walkAnimationSpeed, true);
			}
			else if (keyBinds.moveForwards()) {
				camper.body.velocity.x = this.Settings.Player.horizontalMoveSpeed;
				camper.scale.x = 1;
				camper.animations.play('walk', this.Settings.Player.walkAnimationSpeed, true);
			}
			else {
				camper.animations.play('idle', this.Settings.Player.idleAnimationSpeed, true);
			}
			
			if (keyBinds.jump() && (camper.body.onFloor() || onBox || camperStandingOnCamper)) {
				camper.body.velocity.y = -this.Settings.Player.verticalMoveSpeed;
				//this.Objects.camper.animations.play('jumping', this.Settings.Player.walkAnimationSpeed, false); --DEPRECATED--
			}
			
			if (Phaser.Math.difference(camper.body.x, this.Objects.tent.body.x) <= 50) {
				var lvlComp = game.add.text(430, 288, "Level Complete!", {font:"32px Arial", fill: "#000", align: "center"});
				lvlComp.fixedToCamera = true;
				lvlComp.cameraOffset.setTo(430, 288);
				
				setTimeout(function(){
					game.state.start("level_1");
				}, 2000);
			}
		}

		//Doggy Logic :)
		/*Meow Wuff?*/
		
		var x_diff = Phaser.Math.difference(this.Objects.hotdog.body.x, this.Objects.campers[0].body.x);
		var y_diff = Phaser.Math.difference(this.Objects.hotdog.body.y, this.Objects.campers[0].body.y);
		
		if (x_diff > 50) {
			this.Objects.hotdog.animations.play('walk', 5, true);
			var dogLeftOfCamper = this.Objects.hotdog.body.x < this.Objects.campers[0].body.x;
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
		/** 
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
		} --DEPRECATED-- */
		


	}
};

// load some levelsTitleAndMenu
game.state.add("menu", new titleAndMenu());
game.state.add("level_0", new Level("level_0"));
game.state.add("level_1", new Level("level_1"));

// start at level_0
game.state.start("menu");
