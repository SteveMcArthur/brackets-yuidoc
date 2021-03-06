# Brackets-yuidoc


[Brackets](http://brackets.io/) extension for inserting [YUIDoc](http://yui.github.io/yuidoc/syntax/) comment blocks. Works with JS, CoffeeScript and ES6.

## Usage


In the Brackets editor, select/highlight the property or method that you want to document then either select from the edit menu "Insert YUIDoc property" or use the shortcut keys Ctrl+Alt+Y. A YUIdoc comment block *boilerplate* will be inserted with property/method names etc filled in.

### JavaScript
```js
	/**
	* Description for myMethod
	* @private
	* @method myMethod
	* @param {Object} something
	* @param {Object} somethingElse
	* @return {Object} description
	*/
	function myMethod(something, somethingElse) {
		var result = something + somethingElse;
		return result;
	}

	/**
	* Description for MyClass
	* @private
	* @method MyClass
	* @param {Object} something
	* @param {Object} somethingElse
	* @return {Object} description
	*/
	function MyClass(something, somethingElse) {
		/**
		* Description for something
		* @private
		* @property something
		*/
		this.something = something;
		/**
		* Description for classMethod
		* @private
		* @method classMethod
		* @return {Object} description
		*/
		this.classMethod = function(){
			return this.somethingElse;
		};
	}

	/**
	* Description for myOtherClass
	* @private
	* @method myOtherClass
	* @return {Object} description
	*/
	var myOtherClass = function () {

	};
	
	/**
	* Description for anotherMethod
	* @private
	* @method anotherMethod
	* @return {Object} description
	*/
	myOtherClass.prototype.anotherMethod = function(){
		return this.somethingElse;
	};
	
	/**
	* Description for someotherMethod
	* @private
	* @method someotherMethod
	* @return {Object} description
	*/
	myOtherClass.someotherMethod = function(){
		return this.somethingElse;
	};
```
### CoffeeScript
```coffee
	###*
	# Description for MyClass
	# @class MyClass
	# @constructor
	# @extends someOtherBaseClass.AnotherClass
	###
	class MyClass extends someOtherBaseClass.AnotherClass
	
		###*
		# Description for someProperty
		# @private
		# @property someProperty
		###
		someProperty: 'My Property'
	
		###*
		# Description for myMethod
		# @private
		# @method myMethod
		# @param {Object} something
		# @param {Object} somethingElse
		# @return {Object} description
		###
		myMethod: (something,somethingElse) ->
			return something + somethingElse
```

As you can see from the example, all properties and methods will be labeled as *private*. The extension has no real way of telling if a property is private or not, so by default it labels everything as *private*. The assumption is that it is easier to remove the tag than it is to type it in. For similar reasons, all parameter types are *Objects* and you will need to edit this if that is wrong. Likewise, the description will also need to be edited and a decision made whether you need the return tag and, if so, whether you want a description for the return.


![Screenshot 1](https://raw.githubusercontent.com/SteveMcArthur/brackets-yuidoc/master/screenshot1.jpg)

![Screenshot 2](https://raw.githubusercontent.com/SteveMcArthur/brackets-yuidoc/master/screenshot2.jpg)
