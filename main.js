/* global define, brackets */
define(function (require) {
    "use strict";

    var YUIcomments = require("YUIDocComments");

    var CommandManager = brackets.getModule("command/CommandManager");
    var Menus = brackets.getModule("command/Menus");
	
	var COMMAND_YUIDOC_PROPERTY = 'stevemc.yuicomments.createYUIdocProperty';
	
	CommandManager.register("Insert YUIdoc Property", COMMAND_YUIDOC_PROPERTY, YUIcomments.createYUIdocProperty);
	var editMenu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);

	editMenu.addMenuItem(COMMAND_YUIDOC_PROPERTY,"Ctrl-ALT-Y");


});
