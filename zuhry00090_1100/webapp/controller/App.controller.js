sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("com.hmmausa.myhmma.mypay.zuhry000901100.controller.App", {
        onInit: function() {
        },

        onRefresh: function() {
          //var oModel = this.getView().getModel();
          var oModel2 = this.getView().getModel();
          var oModel = new sap.ui.model.odata.v2.ODataModel();
          
          var carrid = 1;
          var connid = 1;
          var fldate = 1;
          var oContext = this;

          oModel.callFunction(
              "/BAPI_FLIGHT_GETLIST", {
                  method: "GET",
                  urlParameters: {
                     carrierid: carrid,
                     connectionid: connid,
                     flightdate: fldate
                    },
                  success: function(oData, response) {
                     var jModel = new sap.ui.model.json.JSONModel();
                     var myData = {};
                     myData.Fare = oData;
                     jModel.setData(myData);
                     oContext.getView().setModel(jModel, "fareModel");
                    },
                  error: function(oError) {

                    }
                });



        }
      });
    }
  );
  