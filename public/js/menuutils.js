
(function (window, undefined) {

    var MenuUtils = function () {
        /* constructor */
    };
    
    MenuUtils.prototype = MenuUtils.fn = {
        range: function (findBetween, start, finish) {
		    return  findBetween >= start &&
		            findBetween <= finish;
	    },
	    
	    createButton: function (text, top, left, menu) {
	        return {
	            text: text,
	            top: top,
	            left: left,
	            menu: menu
	        };
	    }
    };
    
    window.MenuUtils = MenuUtils;
    
})(window);
