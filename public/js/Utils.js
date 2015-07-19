var Utils = {};

Utils.range = function(findBetween, start, finish) {
	if(findBetween >= start && findBetween <= finish){
		return true;
	}
	else{
		return false;
	}
};

Utils.genRandString = function(len) {
	var chars = '1234567890abcdefghijklmnopqrstuvwxyz', str = '';
	
	for(var i = 0; i < len; i++) {
		str += chars[Math.floor(Math.random() * chars.length)];
	}
	
	return str;
}