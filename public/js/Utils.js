var Utils = {};

Utils.range = function(findBetween, start, finish) {
	if(findBetween >= start && findBetween <= finish){
		return true;
	}
	else{
		return false;
	}
};