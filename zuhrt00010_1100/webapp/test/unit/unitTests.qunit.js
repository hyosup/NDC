/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comhmmausamyhmmamyinfo/zuhrt00010_1100/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
