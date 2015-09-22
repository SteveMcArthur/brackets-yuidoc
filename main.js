/* global define, brackets */
define(function (require) {
    "use strict";

    var stringfunctions = require("string-functions");

    var Commands = brackets.getModule("command/Commands");
    var CommandManager = brackets.getModule("command/CommandManager");
    var Menus = brackets.getModule("command/Menus");
	
	var COMMAND_YUIDOC_PROPERTY = 'stevemc.string-functions.createYUIdocProperty';
	
	CommandManager.register("Insert YUIdoc Property", COMMAND_YUIDOC_PROPERTY, stringfunctions.createYUIdocProperty);
	var editMenu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);

	editMenu.addMenuItem(COMMAND_YUIDOC_PROPERTY,"Ctrl-ALT-Y");


});
