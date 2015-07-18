
(function (window, undefined) {

    var keyBindings = function (game) {
        this.game = game;
    };
    
    keyBindings.prototype = keyBindings.fn = {
        
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
        }
    };
    
    window.KeyBindings = keyBindings;
    
})(window);
