/********************************************************************************************************
* Task ID       : [zuhry00120_1100]
* Task Desc     : [My BENEFIT]
* App ID        : com.hmmausa.myhmma.mypay.zuhry001201100
* App Desc      : [My BENEFIT
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
        "com/hmmausa/myhmma/mypay/zuhry001201100/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("com.hmmausa.myhmma.mypay.zuhry001201100.Component", {
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
            }
        });
    }
);