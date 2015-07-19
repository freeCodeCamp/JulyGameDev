function HomeMenu() {
	var titleStyle = {font:"60px GoodDog", fill: "#f70", align: "center"};
	var defStyle = {font:"40px GoodDog", fill: "black", align: "center"};
	var hoverStyle = {font:"50px GoodDog", fill: "black", align: "center"};
	/*
	 * isLink: Boolean, whether or not to change the cursor to a pointer
	 *     when hovering over
	 * tObj: Pointer, the reference to the actual text object created
	 *     via game.add.text();
	 */
	
	this.buttons = {
		title: { 
			offset_x: 0, offset_y: 0, isLink: false, tObj: null,
			styles: {
				fnt_def: titleStyle, fnt_hover: titleStyle
			}, text: "Camper Survival", callback: function(){}},
		play: { 
			offset_x: 0, offset_y: 100, isLink: true, tObj: null,
			styles: {
				fnt_def: defStyle, fnt_hover: hoverStyle
			}, 
			text: "Play", 
			callback: function(){
				game.state.add('level_0', new Level('level_0'))/*you were also missing a closing parenthasis!!! :p */;
				game.state.start('level_0');
			}
		},
		levels: {
			offset_x: 0, offset_y: 200, isLink: true, tObj: null,
			styles: {
				fnt_def: defStyle, fnt_hover: hoverStyle
			}, 
			text: "Level Select", 
			callback: function(){
				game.state.add('level_menu', new LevelMenu(Global.levels));
				game.state.start('level_menu');
			}
		},
		controls: {
			offset_x: 0, offset_y: 300, isLink: true, tObj: null,
			styles: {
				fnt_def: defStyle, fnt_hover: hoverStyle
			},
			text: "Settings", 
			callback: function(){
				window.alert("This hasn't been implemented yet!")
			}
		}
	};
	
}

HomeMenu.prototype = {
	create: function() {
		
		var self = this;
		
		game.stage.backgroundColor = "#DFE"; // ah that worked :p
		
		var leftOffset = (game.width / 2);
		var topOffset = game.height / 8.0;
		
		$.each(this.buttons, function(i, e){
			
			e.tObj = game.add.text(leftOffset + e.offset_x, topOffset + e.offset_y, e.text, e.styles.fnt_def);
			
			e.tObj.anchor.set(0.5);
			
			e.tObj.inputEnabled = true;
			
			e.tObj.events.onInputDown.add(e.callback, self);
			
			e.tObj.events.onInputOver.add(function(){
				e.tObj.setStyle(e.styles.fnt_hover);
				if(e.isLink) {
					game.canvas.style.cursor = "pointer";
				} else {
					game.canvas.style.cursor = "default";
				}
			}, self);
			
			e.tObj.events.onInputOut.add(function(){
				e.tObj.setStyle(e.styles.fnt_def);
				game.canvas.style.cursor = "default";
			}, self);
			
		});
	}
};