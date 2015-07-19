
(function (window, undefined) {

    var KeyBindings = function (game) {
        this.game = game;
    };
    
    KeyBindings.prototype = KeyBindings.fn = {
        
        jump: function () {
            return  this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) ||
                    this.game.input.keyboard.isDown(Phaser.Keyboard.UP) ||
                    this.game.input.keyboard.isDown(Phaser.Keyboard.W);
        },
        
        moveBackwards: function () {
            return  this.game.input.keyboard.isDown(Phaser.Keyboard.A) ||
                    this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT);
        },
        
        moveForwards: function () {
            return  this.game.input.keyboard.isDown(Phaser.Keyboard.D) ||
                    this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
        },
        
        duck: function () {
            return  this.game.input.keyboard.isDown(Phaser.Keyboard.S) ||
                    this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN);
        },
        
        switchPlayer: function () {
            return  this.game.input.keyboard.isDown(Phaser.Keyboard.C);
        },
        
        nextLevel: function () {
            // intended for debugging only
            return  this.game.input.keyboard.isDown(Phaser.Keyboard.L);
        },
        
        returnToMenu: function () {
            return  this.game.input.keyboard.isDown(Phaser.Keyboard.ESC) ||
                    this.game.input.keyboard.isDown(Phaser.Keyboard.M);
        },
        
        flyMode: function () {
            return  this.game.input.keyboard.isDown(Phaser.Keyboard.F);
        }
    };
    
    window.KeyBindings = KeyBindings;
    
})(window);
