/********************************************************************************************************
* Task ID       : [zuhry00050_1100]
* Task Desc     : [STATE]
* App ID        : com.hmmausa.myhmma.mypay.zuhry000501100
* App Desc      : [STATE]
* Developer     : GICSHR28
* Date          : 2024.04.15
* Type          : Free Style
********************************************************************************************************
* Change History
*&_______________________________________________________________________________________________________
* Ver. No       Change Date        Developer               Requestor           Description of Change
*&_______________________________________________________________________________________________________
*      1          2024.04.15        SHS                     HJ.JANG                     Init   
**********************************************************************************************************
*/

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "sap/ui/model/json/JSONModel",
		"sap/ui/model/odata/v2/ODataModel",
        "com/hmmausa/myhmma/mypay/zuhry000501100/model/models"
    ],
    function (UIComponent, Device, JSONModel,ODataModel, models) {
        "use strict";

        return UIComponent.extend("com.hmmausa.myhmma.mypay.zuhry000501100.Component", {
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

                // set App model
                var sUrl = '/sap/opu/odata/sap/ZGWHRY00050_1100_SRV/';			
                sap.ui.getCore().setModel(
                    new ODataModel(sUrl, {
                        json:true, 
                        useBatch:false, 
                        defaultUpdateMethod:'Put'
                    }
                ), 'ODAT');

                sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel({}), 'ROOT');



				var userModel = new sap.ui.model.json.JSONModel({
                    //syUname: '00100242'
                    syUname: '00100383'
                    
                });
                 this.setModel(userModel, "userModel");


            }
        });
    }
);