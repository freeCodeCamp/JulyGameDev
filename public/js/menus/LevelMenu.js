function LevelMenu(levels) {
	var titleStyle = {font:"60px GoodDog", fill: "#f70", align: "center"};
	var defStyle = {font:"20px GoodDog", fill: "darkgray", align: "center"};
	var hoverStyle = {font:"20px GoodDog", fill: "black", align: "center"};

	this.buttons = {
		title: { 
			offset_x: 0, offset_y: 0, isLink: false, tObj: null,
			styles: {
				fnt_def: titleStyle, fnt_hover: titleStyle
			}, 
			text: "Camper Survival", callback: function(){
				
			}
		}
	};
	var line = 0;
	var col = 0;
	
	for(var x = -500; x < 501; x+500){for(var y = 200; y < 401; y+200){
			console.log(x,y);
		}
	}
		
		
		
		
		
		
	//#original loop - best loop .com
	var col = 0;
	var line = 0;
	for(var i = 0; i <= levels.length; i++){	
		switch(col){
			case 0:
				//left
				break;
			case 1:
				//middle
				break;
			case 2:
				//right
				break;
		}
		
		var menuTopOffset = 100 + (55*line)
		
		col++;
		if(col==3){
			col = 0;
			line++;
		}
	}
	//this.textBox = 
	
	var style = {
		fnt_def: defStyle, 
		fnt_hover: hoverStyle
	};
	/*var mainOffset = 200;
	$.each(levels, function(i, e){
		this.buttons[e] = {
		
		 level_0         level_1        level_2
		   level_3         level_4        level_5
			var x = -500
			var y = false
			var last = []
			
			
			switch(x) {guys i figured it out
				case null: 
					if(y === false)offset_x = -500
					offset_y = 200
					break;
				case -500: 
					offset_x = 0
					break;
				case 0:
					offset_x = 500
					break;
				case 500:
					offset_y = 400
			}
		
			
			
			//offset_x: (mainOffset + this.buttons.indexof(e) * 45), //output should be -500|0|500
			//offset_y: (mainOffset + this.buttons.indexof(e) * 45), //output should be 200|400
			/*styles: style,
			text: e,
			callback: function(){
				game.state.add(e, new Level(e));
				game.state.start(e);
			}
		};
	});*/
}

LevelMenu.prototype = {
	create: function() {
		
		var self = this;
		
		game.stage.backgroundColor = "#DFE"; // ah that worked :p
		
		var leftOffset = (game.width / 2);
		var topOffset = game.height / 8.0;
		
		$.each(this.buttons, function(i, e){
			
			e.tObj = game.add.text(leftOffset + e.offset_x, topOffset + e.offset_y, e.text, e.styles.up);
			
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
		
		window.setTimeout(function(){
			$.each(self.buttons, function(i, e){
				e.tObj.setStyle(e.styles.fnt_def);
			});
		}, 10);
	}
};