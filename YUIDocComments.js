/*global define, brackets*/

define(function (require, exports) {
	"use strict";

	var EditorManager = brackets.getModule('editor/EditorManager');

	var startTag = "/**\n";
	var endTag = "*/\n";
	var t = "* ";

	var yuiProp = "";
	var returnStr = "";
	var closer = "";
	var constr = "";
	var priv = "";

	var whitespace = new RegExp(/^\s+/);
	var nameReg = new RegExp(/^\w+\s(\w+)[\s|\(|=]/);
	var protoReg = new RegExp(/^\w+\.prototype\.(\w+)[\s|\(|=]/);

	/**
	 * Sets the YUIdoc comment tag type:
	 * either js style or coffeescript style
	 * @method setTag
	 * @param {String} indent
	 * @param {Object} editor
	 */
	function setTags(indent, editor) {
		var doc = editor.document;
		var language = doc.getLanguage();
		var fileType = language._id;

		startTag = "/**\n";
		endTag = "*/\n";
		t = "* ";

		if (fileType === "coffeescript") {
			startTag = "###*\n";
			endTag = "###\n";
			t = "# ";
		}
		startTag = startTag;
		endTag = indent + endTag;
		priv = indent + t + "@private\n";

		yuiProp = startTag;
		yuiProp += indent + t + "Description for %n\n";
		yuiProp += priv;
		yuiProp += indent + t + "@%p %n\n";
		returnStr = indent + t + "@return {Object} description\n";
		closer = endTag;
		constr = indent + t + "@constructor\n";
	}

	/**
	 * Works out what the indentation is at the begining of the line.
	 * @method calculateIndent
	 * @param {String} line the current line
	 * @return {String} string representing the line indent
	 */
	function calculateIndent(line) {
		var result = whitespace.exec(line);
		var indent = result ? result[0] : "";
		return indent;
	}


	/**
	 * Extract the property or method name
	 * @method getName
	 * @param {String} line the current line
	 * @return {String} property or method name
	 */
	function getName(line) {
		var text = line.trim();
		var propertyIndex = text.indexOf(":"); //coffeescript
		//special case for coffeescript
		if (propertyIndex > -1) {
			name = text.substr(0, propertyIndex).trim();
			return name;
		}
		var proto = protoReg.exec(text);
		if(proto){
			return proto[1];
		}
		var match = nameReg.exec(text);
		var name = match[1];
		return name;

	}

	var paramReg = new RegExp(/\(.+\)/);

	/**
	* Extracts an array of parameter names
	* @method getParams
	* @param {String} line the current line
	* @return {Array} string array of parameter names
	*/
	function getParams(line) {
		var params = paramReg.exec(line);
		var args = [];
		if (params) {
			console.log("GOT PARAMS: " + params);
			var par = params[0].replace("(", "");
			par = par.replace(")", "");
			var temp = par.split(",");
			args = temp.map(function (item) {
				return item.trim();
			});
		}

		return args;

	}


	/**
	* Determines the property type
	* and returns its string name: method
	* class or property.
	* @method getPropertyOrClass
	* @param {String} line the current line
	* @return {String} the property type
	*/
	function getPropertyOrClass(line) {
		var propertyStr = "property";
		var text = line.trim();
		if (text.substr(0, 5) === "class") {
			propertyStr = "class";
		} else if (text.substr(0, 5) === "const") {
			propertyStr = "class";
		} else if ((text.indexOf("->") > -1) || (text.indexOf("=>") > -1) || (text.indexOf("function") > -1)) {
			propertyStr = "method";
		}
		return propertyStr;
	}

	/**
	* For a class, returns the name
	* of the inherited class, if any.
	* @method getExtensionClass
	* @param {String} line the current line
	* @return {String} the name of the base class
	*/
	function getExtensionClass(line) {
		var text = line.trim();
		var ext = text.indexOf("extends");
		var extObj = "";
		if (ext > -1) {
			extObj = text.substr(ext + 8, text.length - ext);
		}
		return extObj;

	}

	/**
	* Given an array of parameter names,
	* return the comment string for YUIdocs
	* @method getParamStr
	* @param {Array} params string array of parameter names
	* @param {String} indent
	* @return {String} the parameter string
	*/
	function getParamStr(params,indent) {
		var paramStr = "";
		if (params.length > 0) {
			params.forEach(function (item) {
				paramStr += indent + t + "@param {Object} " + item + "\n";
			});
		}
		return paramStr;
	}

	/**
	* Class for building YUIdoc comment block
	* @class YUIDoc
	* @constructor
	*/
	function YUIDoc() {
		var editor = EditorManager.getCurrentFullEditor();
		this.doc = editor.document;
		var sel = editor.getSelection();
		this.start = sel.start;
		this.end = sel.end;
		
		var line = this.doc.getLine(this.start.line);
		this.indent = calculateIndent(line);
		setTags(this.indent, editor);
		this.name = getName(line);
		this.params = getParams(line);
		this.propertyType = getPropertyOrClass(line);
		this.extensionClass = getExtensionClass(line);
		this.line = line;
	}

	/**
	* Writes out the YUIDoc comment block
	* to the editor
	* @method writeBlock
	*/
	YUIDoc.prototype.writeBlock = function () {
		var output = yuiProp;
		var outCloser = closer;
		if (this.propertyType == "class") {
			if (this.extensionClass) {
				outCloser = constr + t + "@extends " + this.extensionClass + "\n" + endTag;
			} else {
				outCloser = constr + endTag;
			}
			output = output.replace(priv, ""); //remove private tag
		}

		output = output.replace(/%p/g, this.propertyType);
		output = output.replace(/%n/g, this.name);
		output += getParamStr(this.params,this.indent);
		var closed = "";
		if (this.propertyType === "method") {
			closed = returnStr;
		}
		var selectedText = this.line.trim();
		console.log("("+outCloser+")");
		console.log("("+output+")");
		
		
		closed += outCloser + this.indent;
		var txt = output + closed  + selectedText;
		

		console.log(txt);
		this.doc.replaceRange(txt, this.start, this.end);
	};
	
	/**
	* Entry point for the extension
	* @method createYUIdocProperty
	*/
	function createYUIdocProperty() {
		var yui = new YUIDoc();
		yui.writeBlock();		
	}

	exports.createYUIdocProperty = createYUIdocProperty;

});