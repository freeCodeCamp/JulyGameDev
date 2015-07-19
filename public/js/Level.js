function Level(level) {
	
	// Objects that are created throughout the game
	this.Objects = {
		//poops: [],  --DEPRECATED--
		boxes: [], 
		campers: [],
		hotdog: null,
		tent: null,
		waitupmsg: null,
		map: null,
		layer: null,
	};
	
	this.currentCamper = 0;
	this.changeTimer = new Date().getTime();
	
	// Various custom states of the objects
	/**this.State = {
		Poop: {
			nextPoopTimeRemaining: Math.floor((Math.random() * 40) + 20) * 1000 // Initial poop
		} 
	}; --DEPRECATED--*/
	
	// Loaded on a per level basis
	this.Settings = Get('levels/' + level + '.json');
	this.levelSwitchTimer = null; // when switching levels, a setTimeout is stored in here so that it only fires once and not multiple times!
};

Level.prototype = {
	
	// Kill/Death
	kill: function (index) {
		if (index !== undefined && index >= 0 && index < this.Objects.campers.length) {
			this.Objects.campers[index].body.x = this.Settings.Player.spawnPoint.x;
			this.Objects.campers[index].body.y = this.Settings.Player.spawnPoint.y;
			// Other stuff
		}
	},
	
	// Movable box
	spawnMovableBox: function(level, x, y) {
		var newBox = game.add.sprite(x, y, 'boxmovable');
		game.physics.arcade.enable(newBox);
		newBox.body.gravity.y = 1000;
		newBox.body.drag.setTo(165);/*boxes should be or a prototype?*/
		level.Objects.boxes.push(newBox);
	},
	
	// Player characters
	spawnCamper: function (spawnX, spawnY, camperImageName) {
		var newCamper = game.add.sprite(spawnX, spawnY, camperImageName);
		game.physics.arcade.enable(newCamper);
		newCamper.body.gravity.y = this.Settings.Player.gravity;
		
		newCamper.body.width = 64;
		newCamper.body.height = 96;
		
		newCamper.anchor.setTo(.5, .5);
		newCamper.animations.add('idle', [0, 0]);
		newCamper.animations.add('walk', [0, 1]);
		//result.animations.add('jumping', [1, 1]); --DEPRECATED--
		return newCamper;
	},
	
	preload: function () {
        game.load.tilemap('map', 'assets/' + this.Settings.mapFile, null, Phaser.Tilemap.TILED_JSON);
        game.load.spritesheet('camper', 'assets/camper.png', 56, 95, 2);
        //game.load.spritesheet('poop', 'assets/poop.png', 16, 16, 2);  --DEPRECATED--
        game.load.spritesheet('hotdog', 'assets/hotdog.png', 52, 29, 2);
        game.load.image('level-x32', 'assets/level-x32.png');
        //game.load.image('level-x32', 'assets/tileset.png');
        game.load.image('tent', 'assets/tent.png');
        game.load.image('waitup', 'assets/waitup.png');
        game.load.image('boxmovable', 'assets/boxmovable.png');
	},
	
	create: function () {
		var self = this;
		
	    game.stage.backgroundColor = '#edfffe';
	    
	    //Starts physics
	    game.physics.startSystem(Phaser.Physics.ARCADE);
	    
	   	// Create Tent
	    this.Objects.tent = game.add.sprite(2810, 20, 'tent');
	    game.physics.arcade.enable(this.Objects.tent);
	    this.Objects.tent.body.gravity.y = 1000;
	    this.Objects.tent.scale.x = 2.5;
	    this.Objects.tent.scale.y = 2.5;
	    
	    // Creates the map
	    this.Objects.map = game.add.tilemap('map');
	    this.Objects.map.addTilesetImage('level-x32');
	    
	    // Define which tiles cannot be moved through
	    this.Objects.map.setCollisionBetween(1, 300);
	    
	    // Intialize the world
	    this.Objects.nonCollidablesLayer = this.Objects.map.createLayer('NonCollidables'); // optional
	    if (this.Objects.nonCollidablesLayer) this.Objects.nonCollidablesLayer.resizeWorld();
	 	this.Objects.layer = this.Objects.map.createLayer('World'); // mandatory
	    this.Objects.layer.resizeWorld();
	    
	    //Create player (sprite)
	    this.Objects.campers[0] = this.spawnCamper(this.Settings.Player.spawnPoint.x, this.Settings.Player.spawnPoint.y, 'camper');
	    this.Objects.campers[1] = this.spawnCamper(this.Settings.Player.spawnPoint.x - 90, this.Settings.Player.spawnPoint.y, 'camper');
	    
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
	    
	    // Spawn Boxes
	    if (this.Settings.Boxes !== undefined) {
	    	// Boxes are now defined in the level.json files
	    	this.Settings.Boxes.map(function (box) {
	    		self.spawnMovableBox(self, box.x, box.y);
	    	});
	    }

	},
	
	update: function () {
		var self = this;
		
		// Sign logic
		if (this.Settings.Signs !== undefined) {
			this.Settings.Signs.map(function (sign) {
				if (sign.obj !== undefined) sign.obj.visible = false;
			});	
		}
		
		this.Objects.campers.map(function(camper, index) {
			// Death by going outside of world
			if (camper.body.x < 0 || camper.body.x > self.Objects.map.widthInPixels || camper.body.y < 0 || camper.body.y > self.Objects.map.heightInPixels) {
				self.kill(index);
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
			var tileNonCollidableColliding = self.Objects.map.getTile(tileX, tileY+2, self.Objects.nonCollidablesLayer, null);
			
			if(tileColliding != null){
				if (tileColliding.collisionCallbackContext.index === 3  || tileColliding.collisionCallbackContext.index === 4) {
					self.kill(index);
				}
			}
			
			/*if(tileBelowR != null){
				if ((tileBelowR.collisionCallbackContext.index === 3  || tileBelowR.collisionCallbackContext.index === 4) && tileBelow === null) {
					self.kill(index);
				}
			}
			
			if(tileBelowL != null){
				if ((tileBelowL.collisionCallbackContext.index === 3  || tileBelowL.collisionCallbackContext.index === 4) && tileBelow === null) {
					self.kill(index);
				
			}*/
			
			if(tileBelow != null){
				if (tileBelow.collisionCallbackContext.index === 3  || tileBelow.collisionCallbackContext.index === 4) {
					self.kill(index);
				}
			}
			
			// Sign collision logic
			if (tileNonCollidableColliding != null) {
				if (tileNonCollidableColliding.collisionCallbackContext.index == 16) {
					var signUndefined = true;
					if (self.Settings.Signs !== undefined) {
						self.Settings.Signs.map(function (sign) {
							if (sign.x == tileX && sign.y == tileY) {
								signUndefined = false;
								
								// create text if needed
								if (sign.obj === undefined) {
									sign.obj = game.add.text(tileX * 32, tileY * 32 - 32, sign.text, {font:"18px Arial", fill: "#333", align: "center"});
								}
								sign.obj.visible = true;
							}
						});
					}
					if (signUndefined) {
						console.log('undefined sign message @ tile: ' + tileX + ', ' + tileY);
					}
				}
			}

			game.physics.arcade.collide(camper, self.Objects.layer);
			
			camper.body.velocity.x = 0;
		});
		
		// Tent world collision handling
		game.physics.arcade.collide(this.Objects.tent, this.Objects.layer);
		// Hotdog world collision handling
		game.physics.arcade.collide(this.Objects.hotdog, this.Objects.layer);
		
		// Localcamper is the camper you control locally on your own machine
		var localCamper = self.Objects.campers[self.currentCamper];
		// Othercamper is the remote camper (player 2 connected through the network)
		var otherCamper = self.Objects.campers[1 - self.currentCamper];
		
		// Resolve jumping while standing on the other camper
		//var campersColliding = game.physics.arcade.collide(this.Objects.campers[0], this.Objects.campers[1]);
		//var camperStandingOnCamper = false;
		//if (campersColliding && otherCamper.body.y >= (localCamper.body.y + localCamper.body.height)) {
		//	camperStandingOnCamper = true;
		//}
		
		// Resolve jumping while standing on boxes
		var onBox = false, boxArray = this.Objects.boxes;

		boxArray.forEach(function (box) {
		
			boxArray.forEach(function (box2) {
				if(box !== box2) game.physics.arcade.collide(box, box2);
			});
			
			// Check collision between world and box
			// BUG: somehow the camper is still able to push objects through the tiles, even though we check for collision here
			game.physics.arcade.collide(box, self.Objects.layer);
			
			// Collide both campers, but only allow jump logic for localcamper
			var localBoxCollided = game.physics.arcade.collide(localCamper, box);
			game.physics.arcade.collide(otherCamper, box);
			
			if(localBoxCollided && box.body.y >= (localCamper.body.y + localCamper.body.height)) {
				onBox = true;
			}
		
		});
		
		
		// The waitup message follows the dog
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
					this.Objects.campers[0].animations.play('idle', this.Settings.Player.idleAnimationSpeed, true);
					this.currentCamper = 1;
					game.camera.follow(this.Objects.campers[1]);
				} else {
					this.Objects.campers[1].animations.play('idle', this.Settings.Player.idleAnimationSpeed, true);
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
			
			//if (keyBinds.jump() && (camper.body.onFloor() || onBox || camperStandingOnCamper)) {
			if (keyBinds.jump() && (camper.body.onFloor() || onBox)) {
						
				camper.body.velocity.y = -this.Settings.Player.verticalMoveSpeed;
				//this.Objects.camper.animations.play('jumping', this.Settings.Player.walkAnimationSpeed, false); --DEPRECATED--
			}
			
			if (Phaser.Math.difference(camper.body.x, this.Objects.tent.body.x) <= 50 || keyBinds.nextLevel()) {
				var lvlComp = game.add.text(430, 288, "Level Complete!", {font:"32px Arial", fill: "#000", align: "center"});
				lvlComp.fixedToCamera = true;
				lvlComp.cameraOffset.setTo(430, 288);
				
				if (this.levelSwitchTimer === null) {
					this.levelSwitchTimer = setTimeout(function () {
						this.levelSwitchTimer = null;
						console.log("Switching to state: " + self.Settings.NextLevel);
						game.state.add(self.Settings.NextLevel);
						game.state.start(self.Settings.NextLevel);
					}, 2000);
				}
			}
			
			if (keyBinds.returnToMenu()) {
				game.state.start("home_menu");
			}
		}

		//Doggy Logic :)
		/*Meow Wuff?*/
		/* Bow wow wow */
		var followingCamper = this.Objects.campers[0];
		var x_diff = Phaser.Math.difference(this.Objects.hotdog.body.x, followingCamper.body.x);
		var y_diff = Phaser.Math.difference(this.Objects.hotdog.body.y, followingCamper.body.y);
		
		if (x_diff > 50) {
			// Walk towards the camper
			this.Objects.hotdog.animations.play('walk', 5, true);
			var dogLeftOfCamper = this.Objects.hotdog.body.x < followingCamper.body.x;
			this.Objects.hotdog.body.velocity.x = dogLeftOfCamper ? 100 : -100;
			this.Objects.hotdog.scale.x = dogLeftOfCamper ? 1 : -1;
		} else {
			this.Objects.hotdog.animations.stop(true);
			this.Objects.hotdog.body.velocity.x = 0;
		}
		
		if (this.Objects.hotdog.body.onWall()) {
			this.Objects.hotdog.body.velocity.y = -100;
		}
		
		// If you move away from the dog too far, it will yell to you to wait for him!
		this.Objects.waitupmsg.visible = x_diff > 190;
		
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
		} */

	},

	render: function() {
		//game.debug.body(this.Objects.campers[0]);
		//game.debug.body(this.Objects.campers[1]);
		//game.debug.body(this.Objects.hotdog);
	}
	
};