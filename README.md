# Brackets-yuidoc


[Brackets](http://brackets.io/) extension for inserting [YUIDoc](http://yui.github.io/yuidoc/syntax/) comment blocks. Works with JS, CoffeeScript and ES6.

## Usage


In the Brackets editor, select/highlight the property or method that you want to document then either select from the edit menu "Insert YUIDoc property" or use the shortcut keys Ctrl+Alt+Y. A YUIdoc comment block *boilerplate* will be inserted with property/method names etc filled in.

```
/**
* Description for init
* @private
* @method init
* @param {Object} params
* @return {Object} description
*/
function init(params) {

}



/**
* Description for init 
* @private
* @method init 
* @param {Object} params
* @return {Object} description
*/
init = function (params) {

}



/**
* Description for init 
* @private
* @method init 
* @param {Object} params
* @return {Object} description
*/
this.init = function (params) {

}



/**
* Description for init
* @private
* @method init
* @param {Object} params
* @return {Object} description
*/
this.init: function (params) {

}

```

As you can see from the example, all properties and methods will be labeled as *private*. The extension has no real way of telling if a property is private or not, so by default it labels everything as *private*. The assumption is that it is easier to remove the tag than it is to type it in. For similar reasons, all parameter types are *Objects* and you will need to edit this if that is wrong. Likewise, the description will also need to be edited and a decision made whether you need the return tag and, if so, whether you want a description for the return.


![demo1](https://raw.githubusercontent.com/zhaopengme/brackets-yuidoc-ext/master/demo1.gif)

![demo2](https://raw.githubusercontent.com/zhaopengme/brackets-yuidoc-ext/master/demo2.gif)

![demo3](https://raw.githubusercontent.com/zhaopengme/brackets-yuidoc-ext/master/demo3.gif)

![demo4](https://raw.githubusercontent.com/zhaopengme/brackets-yuidoc-ext/master/demo4.gif)
