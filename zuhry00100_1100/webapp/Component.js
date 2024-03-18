/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/model/json/JSONModel",
        "sap/ui/Device",
        "com/hmmausa/myhmma/mypay/zuhry001001100/model/models"
    ],
    function (UIComponent, JSONModel, Device, models) {
        "use strict";

        return UIComponent.extend("com.hmmausa.myhmma.mypay.zuhry001001100.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                // this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                 // set data model
				var oData = {
					Currency: 'USD',
					sample: {
						Begda: new Date('2022-10-03'),
						Endda: new Date('2023-09-20'),
						listInfo: { rowCount: 2 },
						list: [
							{Datum: new Date('2023-06-22 15:46:00:000'),
								CheckVal: '',
								TypeVal: 'H201',
								LocationVal: 'Hyundai Motor Manufacturing Alabama',
                                From: 'W2 - Wage and Tgax Statement',
								AmountVal: 'W-2 Wage'},
							{Datum: new Date('2023-06-22 15:04:00:000'),
								CheckVal: '262',
								TypeVal: 'H201',
								LocationVal: 'Hyundai Motor Manufacturing Alabama',
                                From: 'W2 - Wage and Tgax Statement',
								AmountVal: '52.36'},
						],
						Badge: '1234567',
						ChargesN: '1',
						ChargesT: '52.36',
						PaymentsN: '1',
						PaymentsT: '-52.36',
						DatumS: new Date('2022-10-03'),
						DatumE: new Date('2023-09-20'),
						Balance: '104.72',
					}
				};
				var oModel = new JSONModel(oData);
				this.setModel(oModel);
            }
        });
    }
);