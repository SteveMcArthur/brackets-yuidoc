function myMethod(something, somethingElse) {
	var result = something + somethingElse;
	return result;
}

function MyClass(something, somethingElse) {
	this.something = something;
	this.somethingElse = somethingElse;
	this.classMethod = function(){
		return this.something;
	};
}

var myOtherClass = function (something, somethingElse) {
	this.something = something;
	this.somethingElse = somethingElse;
	this.classMethod = function(){
		return this.something;
	};
};

myOtherClass.prototype.anotherMethod = function(){
	return this.somethingElse;
};