/********************************************************************************************************
* Task ID       : [zuhry00080_1100]
* Task Desc     : [PROGRAM STATUS]
* App ID        : com.hmmausa.myhmma.mypay.zuhry000801100
* App Desc      : [PROGRAM STATUS]
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
        "com/hmmausa/myhmma/mypay/zuhry000801100/model/models"
    ],
    function (UIComponent, Device, JSONModel,ODataModel, models) {
        "use strict";
        return UIComponent.extend("com.hmmausa.myhmma.mypay.zuhry000801100.Component", {
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
                // https://gocoding.org/ko/%EC%97%AC%EB%9F%AC-odata-%EC%84%9C%EB%B9%84%EC%8A%A4%EC%97%90-%EB%8C%80%ED%95%9C-ui5-%EB%A7%A4%EB%8B%88%ED%8E%98%EC%8A%A4%ED%8A%B8-%ED%8C%8C%EC%9D%BC/
                var sUrl = '/sap/opu/odata/sap/ZGWHRY00080_1100_SRV/';			
                sap.ui.getCore().setModel(
                    new ODataModel(sUrl, {
                        json:true, 
                        useBatch:false, 
                        defaultUpdateMethod:'Put'
                        // ,metadataUrlParams: { 'sap-client': '410' }
                    }
                ), 'ODAT');

                sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel({}), 'ROOT');
                    
                // For UserInfo, For backdoor                
                // https://stackoverflow.com/questions/45728567/openui5-get-data-from-jsonmodel
                // https://stackoverflow.com/questions/38134082/loading-a-model-with-name-in-sapui5
                /*
                var userModel = new JSONModel();
                var userSysModel = new sap.ui.model.json.JSONModel("/sap/bc/ui2/start_up");
                var that = this;
                userSysModel.attachRequestCompleted(function(data) { 
                    let userId = userSysModel.getData().id;
                    let userUrl = "/sap/opu/odata/SAP/YTEST_ODATA02_SRV/UserInfoSet?$filter=Input eq '{\"i_employee_number\":\""+userId+"\"}'";

                    var userModel = new sap.ui.model.json.JSONModel(userUrl);
                        userModel.attachRequestCompleted(function(data) { 
                            var oDdata = JSON.parse(userModel.getData().d.results[0].Output);
                            userModel.setData(oDdata);
                            that.setModel(userModel, "userModel");
                        });
                });  
                this.setModel(userSysModel, "userapi");
                sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel({}), 'ROOT');
                */
                var userModel = new sap.ui.model.json.JSONModel({
                    syUname: '00100242'
                });
                 this.setModel(userModel, "userModel");


            }
        });
    }
);