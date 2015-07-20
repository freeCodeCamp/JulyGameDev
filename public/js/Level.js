function Level(level) {
	
	this.ObjectCache = {
		boxes: []
	};
	
	// Objects that are created throughout the game
	this.Objects = [];

	this.currentCamper = 0;
	this.changeTimer = new Date().getTime();
	this.flyMode = false;
	this.flyTimer = new Date().getTime();
	
	// Loaded on a per level basis
	this.Settings = Get('levels/' + level + '.json');
	this.levelSwitchTimer = null; // when switching levels, a setTimeout is stored in here so that it only fires once and not multiple times!
};

Level.prototype = {
	
	encodeState: function(){
	    var state = [];
	    
	    $.each(this.Objects, function(i, e){
	    	if(e.sync == true) {
	    		state.push({id: e.id, x: e.obj.body.x, y: e.obj.body.y});
	    	}
	    });
	    
	    return state;
	},
	
	// state should be an array, this function will take that array 
	decodeState: function(state){
		var self = this;
		
	    $.each(state, function(i, e){
	   		var obj = self.getObjectById(e.id);
	   		obj.obj.x = e.x + obj.obj.width / 2;
	   		obj.obj.y = e.y + obj.obj.height / 2;
	    });
	},
	
	getObjectById: function(id) {
		var obj = null;
		$.each(this.Objects, function(i, e){
			if(e.id == id) {
				obj = e;
				return false;
			}
		});
		return obj;
	},
	
	pushObject: function(id, obj, sync) {
		
		// by default sync every pushed object
		if(sync == undefined) sync = true;
		
		this.Objects.push({id: id, obj: obj, sync: sync});
		
		return obj;
	},
	
	// Kill/Death
	kill: function (camper) {
		camper.body.x = this.Settings.Player.spawnPoint.x;
		camper.body.y = this.Settings.Player.spawnPoint.y;
	},
	
	// Movable box
	spawnMovableBox: function(level, x, y) {
		var newBox = game.add.sprite(x, y, 'boxmovable');
		game.physics.arcade.enable(newBox);
		newBox.body.gravity.y = 1000;
		newBox.body.drag.setTo(165);/*boxes should be or a prototype?*/
		level.ObjectCache.boxes.push(newBox);
		return newBox;
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
		
		return newCamper;
	},
	
	updateCamper: function(camper) {
		// Death by going outside of world
		if (camper.body.x < 0 || camper.body.x > this.ObjectCache.map.widthInPixels || camper.body.y < 0 || camper.body.y > this.ObjectCache.map.heightInPixels) {
			this.kill(camper);
		}
		
		// Tile colllision
		/* Logic fo working with collisions and collision data */
		// TODO: add destruction for boxes and the dog no the lava/spikes
		var tileX = Math.round(camper.body.x / 32);
		var tileY = Math.round(camper.body.y / 32);
		
		var tileBelow = this.ObjectCache.map.getTile(tileX, tileY+3, this.ObjectCache.layer, null);
		var tileBelowR = this.ObjectCache.map.getTile(tileX+1, tileY+2, this.Objects.layer, null);
		var tileBelowL = this.ObjectCache.map.getTile(tileX-1, tileY+2, this.Objects.layer, null);
		var tileColliding = this.ObjectCache.map.getTile(tileX, tileY+2, this.ObjectCache.layer, null);
		var tileNonCollidableColliding = this.ObjectCache.map.getTile(tileX, tileY+2, this.ObjectCache.nonCollidablesLayer, null);
		
		if(tileColliding != null){
			if (tileColliding.collisionCallbackContext.index === 3  || tileColliding.collisionCallbackContext.index === 4) {
				this.kill(camper);
			}
		}
		
		if(tileBelowR != null){
			if ((tileBelowR.collisionCallbackContext.index === 3  || tileBelowR.collisionCallbackContext.index === 4) && tileBelow === null) {
				this.kill(camper);
			}
		}
		
		if(tileBelowL != null){
			if ((tileBelowL.collisionCallbackContext.index === 3  || tileBelowL.collisionCallbackContext.index === 4) && tileBelow === null) {
				this.kill(camper);
			}
		}
		
		if(tileBelow != null){
			if (tileBelow.collisionCallbackContext.index === 3  || tileBelow.collisionCallbackContext.index === 4) {
				this.kill(camper);
			}
		}
		
		// Sign collision logic
		if (tileNonCollidableColliding != null) {
			if (tileNonCollidableColliding.collisionCallbackContext.index == 16) {
				var signUndefined = true;
				if (this.Settings.Signs !== undefined) {
					this.Settings.Signs.map(function (sign) {
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

		game.physics.arcade.collide(camper, this.ObjectCache.layer);
		
		camper.body.velocity.x = 0;
	},
	
	preload: function () {
        game.load.tilemap('map', 'assets/maps/' + this.Settings.mapFile, null, Phaser.Tilemap.TILED_JSON);
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
		
	    game.stage.backgroundColor = '#79d2e2';
	    
	    //Starts physics
	    game.physics.startSystem(Phaser.Physics.ARCADE);
	    
	   	// Create Tent
	    this.ObjectCache.tent = this.pushObject('tent', game.add.sprite(2810, 20, 'tent'), false);
	    
	    game.physics.arcade.enable(this.ObjectCache.tent);
	    this.ObjectCache.tent.body.gravity.y = 1000;
	    this.ObjectCache.tent.scale.x = 2.5;
	    this.ObjectCache.tent.scale.y = 2.5;
	    
	    // Creates the map
	    this.ObjectCache.map = game.add.tilemap('map');
	    this.ObjectCache.map.addTilesetImage('level-x32');
	    
	    // Define which tiles cannot be moved through
	    this.ObjectCache.map.setCollisionBetween(1, 300);
	    
	    this.ObjectCache.nonCollidablesLayer = this.ObjectCache.map.createLayer('NonCollidables'); // optional
	    if (this.ObjectCache.nonCollidablesLayer) this.ObjectCache.nonCollidablesLayer.resizeWorld();
	    
	    this.ObjectCache.nonCollidablesLayer2 = this.ObjectCache.map.createLayer('NonCollidables2'); // optional
	    if (this.ObjectCache.nonCollidablesLayer2) this.ObjectCache.nonCollidablesLayer2.resizeWorld();
	    
	    
	 	this.ObjectCache.layer = this.ObjectCache.map.createLayer('World'); // mandatory
	    this.ObjectCache.layer.resizeWorld();
	    
	    //Create player (sprite)
	    this.ObjectCache.camper_0 = this.pushObject('camper_0', this.spawnCamper(this.Settings.Player.spawnPoint.x, this.Settings.Player.spawnPoint.y, 'camper'));
	    this.ObjectCache.camper_1 = this.pushObject('camper_1', this.spawnCamper(this.Settings.Player.spawnPoint.x - 90, this.Settings.Player.spawnPoint.y, 'camper'));
	    
	    // Camera center follows player
	    game.camera.follow(this.ObjectCache.camper_0);
	    
	    // Create the dog (follower)
	    this.ObjectCache.hotdog = this.pushObject('hotdog', game.add.sprite(300, 550, 'hotdog'), false);
	    game.physics.arcade.enable(this.ObjectCache.hotdog);
	    this.ObjectCache.hotdog.animations.add('walk');
	    this.ObjectCache.hotdog.body.gravity.y = 500;
	    this.ObjectCache.hotdog.anchor.setTo(.5, .5);
	    
	    // Dog tells you to wait for him
	    this.ObjectCache.waitupmsg = this.pushObject('waitupmsg', game.add.sprite(300, 550, 'waitup'), false);
	    this.ObjectCache.waitupmsg.visible = false;
	    game.physics.arcade.enable(this.ObjectCache.waitupmsg);
	    
	    // Spawn Boxes
	    if (this.Settings.Boxes !== undefined) {
	    	$.each(this.Settings.Boxes, function(i, e){
	    		self.ObjectCache.boxes.push(self.pushObject('box_' + i, self.spawnMovableBox(self, e.x, e.y)));
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
		
		// Tent world collision handling
		game.physics.arcade.collide(this.ObjectCache.tent, this.ObjectCache.layer);
		// Hotdog world collision handling
		game.physics.arcade.collide(this.ObjectCache.hotdog, this.ObjectCache.layer);
		
		this.updateCamper(this.ObjectCache.camper_0);
		this.updateCamper(this.ObjectCache.camper_1);
		
		// Resolve jumping while standing on boxes
		var onBox = false, boxArray = this.ObjectCache.boxes;

		boxArray.forEach(function (box) {
		
			boxArray.forEach(function (box2) {
				if(box !== box2) game.physics.arcade.collide(box, box2);
			});
			
			// Check collision between world and box
			// BUG: somehow the camper is still able to push objects through the tiles, even though we check for collision here
			game.physics.arcade.collide(box, self.ObjectCache.layer);
			
			// Collide both campers, but only allow jump logic for localcamper
			var localBoxCollided = game.physics.arcade.collide(self.ObjectCache.camper_0, box);
			
			game.physics.arcade.collide(self.ObjectCache.camper_1, box);
			
			if(localBoxCollided && box.body.y >= (self.ObjectCache.camper_0.body.y + self.ObjectCache.camper_0.body.height)) {
				onBox = true;
			}
		
		});
		
		
		// The waitup message follows the dog
		game.physics.arcade.moveToXY(
			this.ObjectCache.waitupmsg,
			this.ObjectCache.hotdog.body.x, 
			this.ObjectCache.hotdog.body.y - this.ObjectCache.waitupmsg.body.height, 
			this.Settings.Dog.horizontalMoveSpeed
		);
		
		//Player controls
		if (keyBinds.switchPlayer()) {
			if (new Date().getTime() >= this.changeTimer) {
				this.changeTimer = new Date().getTime() + 500;
				if (this.currentCamper === 0) {
					this.ObjectCache.camper_0.animations.play('idle', this.Settings.Player.idleAnimationSpeed, true);
					this.currentCamper = 1;
					game.camera.follow(this.ObjectCache.camper_1);
				} else {
					this.ObjectCache.camper_1.animations.play('idle', this.Settings.Player.idleAnimationSpeed, true);
					this.currentCamper = 0;
					game.camera.follow(this.ObjectCache.camper_0);
				}
			}
		}
		
		if (keyBinds.flyMode()) {
			if (new Date().getTime() >= this.flyTimer) {
				this.flyTimer = new Date().getTime() + 500;
				this.flyMode = !this.flyMode;
			}
		}
		
		// Singleplayer
		if (1 === 1) {
			var camper = (this.currentCamper == 0) ? this.ObjectCache.camper_0 : this.ObjectCache.camper_1;
			
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
			if (keyBinds.jump() && (camper.body.onFloor() || onBox || this.flyMode)) {
						
				camper.body.velocity.y = -this.Settings.Player.verticalMoveSpeed;
				//this.Objects.camper.animations.play('jumping', this.Settings.Player.walkAnimationSpeed, false); --DEPRECATED--
			}
			
			if (Phaser.Math.difference(camper.body.x, this.ObjectCache.tent.body.x) <= 50 || keyBinds.nextLevel()) {
				var lvlComp = game.add.text(430, 288, "Level Complete!", {font:"32px Arial", fill: "#000", align: "center"});
				lvlComp.fixedToCamera = true;
				lvlComp.cameraOffset.setTo(430, 288);
				
				if (this.levelSwitchTimer === null) {
					this.levelSwitchTimer = setTimeout(function () {
						this.levelSwitchTimer = null;
						game.state.add(self.Settings.NextLevel, new Level(self.Settings.NextLevel));
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
		var x_diff = Phaser.Math.difference(this.ObjectCache.hotdog.body.x, this.ObjectCache.camper_0.body.x);
		var y_diff = Phaser.Math.difference(this.ObjectCache.hotdog.body.y, this.ObjectCache.camper_0.body.y);
		
		if (x_diff > 50) {
			// Walk towards the camper
			this.ObjectCache.hotdog.animations.play('walk', 5, true);
			var dogLeftOfCamper = this.ObjectCache.hotdog.body.x < this.ObjectCache.camper_0.body.x;
			this.ObjectCache.hotdog.body.velocity.x = dogLeftOfCamper ? 100 : -100;
			this.ObjectCache.hotdog.scale.x = dogLeftOfCamper ? 1 : -1;
		} else {
			this.ObjectCache.hotdog.animations.stop(true);
			this.ObjectCache.hotdog.body.velocity.x = 0;
		}
		
		if (this.ObjectCache.hotdog.body.onWall()) {
			this.ObjectCache.hotdog.body.velocity.y = -100;
		}
		
		// If you move away from the dog too far, it will yell to you to wait for him!
		this.ObjectCache.waitupmsg.visible = x_diff > 190;
	},

	render: function() {
		//game.debug.body(this.Objects.campers[0]);
		//game.debug.body(this.Objects.campers[1]);
		//game.debug.body(this.Objects.hotdog);
	}
	
};