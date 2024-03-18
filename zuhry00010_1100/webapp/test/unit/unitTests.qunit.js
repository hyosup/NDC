/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comhmmausamyhmmamypay/zuhry00010_1100/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
