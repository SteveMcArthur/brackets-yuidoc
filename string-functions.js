/*global define, brackets*/

define(function (require, exports) {
	"use strict";

	var DocumentManager = brackets.getModule('document/DocumentManager');
	var EditorManager = brackets.getModule('editor/EditorManager');

	var startTag = "/**\n";
	var endTag = "*/\n";
	var t = "* ";

	var yuiProp = "";
	var returnStr = "";
	var closer = "";
	var constr = "";
	var priv = "";

	/**
	 * Description for setTag
	 * @private
	 * @method setTag
	 * @param {Object} indent
	 * @return {Object} description
	 */
	function setTag(indent, editor) {
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
	 * @param {Object} editor the current brackets editor
	 * @return {String} string representing the line indent
	 */
	function calculateIndent(editor) {
		var doc = editor.document;
		var start = editor.getCursorPos();
		var selectedText = editor.getSelectedText();
		var startCh = selectedText[0];
		var line = doc.getLine(start.line);

		var indent = "";

		if (line[0] !== selectedText[0]) {
			for (var i = 0; i < line.length; i++) {
				if (line[i] !== startCh) {
					indent += line[i];
				} else {
					break;
				}
			}

		}
		return indent;
	}

	/**
	 * Extract the property or method name
	 * @method getName
	 * @param {String} text the selected text
	 * @return {String} property or method name
	 */
	function getName(text) {
		var name = text;
		var propertyIndex = name.indexOf(":"); //coffeescript
		var functionIndex = name.indexOf("function"); //javascript
		var classIndex = name.indexOf("class"); //coffeescript
		if (propertyIndex > -1) {
			name = name.substr(0, propertyIndex).trim();
		} else if (functionIndex > -1) {
			var brack = name.indexOf("(");
			functionIndex += 8;
			var len = brack - functionIndex;
			name = name.substr(functionIndex, len).trim();
		} else if (classIndex > -1) {
			//the word class will be first six characters
			//and after that will be the name
			name = name.substr(6, name.length - 6);
			var k = name.indexOf(' ');
			name = name.substr(0, k);
		}
		return name;

	}

	var paramReg = new RegExp(/\(.+\)/);

	/**
	* Generates a string containing the YUIdoc
	* tags for any parameters
	* @method getParams
	* @param {String} text
	* @param {String} indent
	* @return {String} the parameter string
	*/
	function getParams(text, indent) {
		var params = paramReg.exec(text);
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

		var paramStr = "";

		if (args.length > 0) {
			args.forEach(function (item) {
				paramStr += indent + t + "@param {Object} " + item + "\n";
			});
		}

		return paramStr;

	}

	/**
	* Description for getPropertyOrClass
	* @method getPropertyOrClass
	* @param {Object} text
	* @return {Object} description
	*/
	function getPropertyOrClass(text) {
		var propertyStr = "property {Object}";
		var outCloser = "";
		if (text.substr(0, 5) === "class") {
			propertyStr = "class";

			var ext = text.indexOf("extends");

			if (ext > -1) {
				var extObj = text.substr(ext + 8, text.length - ext);
				outCloser = constr + t + "@extends " + extObj + "\n" + endTag;
			} else {
				outCloser = constr + endTag;
			}
		} else if ((text.indexOf("->") > -1) || (text.indexOf("=>") > -1) || (text.indexOf("function") > -1)) {
			propertyStr = "method";
		}
		return {
			propertyStr: propertyStr,
			outCloser: outCloser
		};
	}

	/**
	 * Main entry point
	 * @method createYUIdocProperty
	 */
	function createYUIdocProperty() {
		var doc = DocumentManager.getCurrentDocument();
		var currentEditor = EditorManager.getCurrentFullEditor();
		var indent = calculateIndent(currentEditor);
		setTag(indent, currentEditor);

		var selectedText = currentEditor.getSelectedText();

		var selectedPos = currentEditor.getSelection();

		var output = yuiProp;
		var outCloser = closer;

		var result = getPropertyOrClass(selectedText);
		var propertyStr = result.propertyStr;
		if (result.outCloser) {
			outCloser = result.outCloser;
		}

		if (propertyStr === "class") {
			//remove the @private tag
			output = output.replace(priv, "");
		}

		output = output.replace(/%p/g, propertyStr);

		var name = getName(selectedText);
		output = output.replace(/%n/g, name);

		var paramStr = getParams(selectedText, indent);
		output += paramStr;

		var closed = "";
		if (propertyStr === "method") {
			closed = returnStr;
		}

		closed += outCloser + indent;
		var txt = output + closed + selectedText;

		var start = selectedPos.start;
		var end = selectedPos.end;
		doc.replaceRange(txt, start, end);

	}


	exports.createYUIdocProperty = createYUIdocProperty;

});