/********************************************************************************************************
* Task ID       : [zuhry00070_1100]
* Task Desc     : [TAXES W2 DELIVERY METHOD]
* App ID        : com.hmmausa.myhmma.mypay.zuhry000701100
* App Desc      : [TAXES W2 DELIVERY METHOD]
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
sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox",
        "sap/m/MessageToast"
    ],
    function(BaseController, MessageBox, MessageToast) {
      "use strict";
  
      return BaseController.extend("com.hmmausa.myhmma.mypay.zuhry000701100.controller.App", {
        onInit: function() {
          const oView = this.getView();
          const oModelR = sap.ui.getCore().getModel('ROOT');
          oView.setModel(oModelR);
          oView.bindObject({ path: '/' });
          this.onSearch();
        },
        // onSelectItem: function () {
        //     var oList =  this.byId("idDeliverySelect");
        //     oList.setSelectedKey("02");
        // },

        onSearch: function () {
            var that = this;
            const oView = this.getView();
            const oContext = oView.getBindingContext();
            const oUserModel = oView.getModel('userModel');
            let oFilter = {
              i_pernr : oUserModel.getData().syUname //사용자 아이디.
            };
            let aFilter = [
                new sap.ui.model.Filter({
                path: 'Input',
                operator: sap.ui.model.FilterOperator.EQ,
                value1:
                    typeof oFilter === 'string' ? oFilter : JSON.stringify(oFilter),
                })
            ];
            /* oData Service Model 호출 */
            const oModelO = sap.ui.getCore().getModel('ODAT');
            oModelO.read('/ZFHRY_W2S_CHECK_HISTORY_1100Set', {
                async: false,
                filters: aFilter,
                success: oRespData => {
                    let aData = JSON.parse(oRespData.results[0].Output);
                    var sReturnType = aData.e_return.type; // 
                    var sReturnMessage = aData.e_return.message; // 
                    var sReturnTitle="";
                    var sIcon = MessageBox.Icon.NONE;
                        switch (sReturnType) {
                            case 'S':   //성공
                                  sReturnTitle =  "Success"
                                  sIcon = MessageBox.Icon.SUCCESS;
                                  
                                  let  smethodElected = aData.e_method_elected; // Elected delivery method 선택 배송방법
                                  var oList =  that.byId("idDeliverySelect");
                                    oList.setSelectedKey(smethodElected);
                            
                                MessageToast.show(sReturnMessage+":::::::e_method_elected:"+smethodElected);
                                break;
                            case 'E':   //오류
                                sReturnTitle =  "Error"
                                sIcon = MessageBox.Icon.ERROR;
                                MessageBox.show(sReturnMessage, {
                                    icon: sIcon,
                                    title: sReturnTitle,
                                    actions: MessageBox.Action.OK,
                                    onClose: function (oAction) {
                                        if (oAction === 'OK') {
                                            /** */
                                        }
                                    }
                                });
                                break;
                            default:
                                sIcon = MessageBox.Icon.NONE;
                                break;
                        }
                    oView.setBusy(false);
                },
                error: oError => {
                  sap.m.MessageToast.show("["+oError.statusCode+"] "+oError.message);
                  oView.setBusy(false);
                },
            });
        },
        
        makeOdataFilter : function(oFilter) {
                var mFilter = [];
                
                for(var sKey in oFilter) {
                    var oVal = oFilter[sKey];

                    if(!(oVal instanceof Object) || oVal instanceof Date) {
                        if(oVal) {
                            mFilter.push(new sap.ui.model.Filter({
                                path: sKey,
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: oVal
                            }));
                        }
                    // Array로 입력된 Tokens값 처리
                    } else if(Array.isArray(oVal)) {
                        if(oVal.length > 0) {
                            for (var sArrayKey in oVal) {
                                var oFilterVal = oVal[sArrayKey];
        
                                mFilter.push(new sap.ui.model.Filter({
                                    path: sKey,
                                    operator: oFilterVal.operation,
                                    value1: oFilterVal.value1,
                                    value2: oFilterVal.value2
                                }));
                            }
                        }
                        
                    } else {
                        mFilter.push(new sap.ui.model.Filter({
                            path: sKey,
                            operator: sap.ui.model.FilterOperator.BT,
                            value1: oVal.value1,
                            value2: oVal.value2
                        }));
                    }
                }
          return mFilter;
        },

        onSave: function () {
          var that = this;
          var oView = this.getView();
          var oModel = this.getView().getModel();
          var oModelO = sap.ui.getCore().getModel('ODAT');
          var oFilter = {};// gateway로 보낼 조회조건
          const oUserModel = oView.getModel('userModel');
          var oList =  this.byId("idDeliverySelect"); // 선택된 값

          var oData = {};
            oData.i_pernr = oUserModel.getData().syUname; //사용자 아이디.
            oData.i_method_elected = oList.getSelectedKey();

            oFilter.Input = JSON.stringify(oData);
            that.getView().setBusy(true);

            oModelO.read("/ZFHRY_W2S_UPDATE_HISTORY_1100Set", {
                async: false,
                filters: this.makeOdataFilter(oFilter),
                success: function (oRespData ) { // 메세지를 받아오기 위해 response 추가
                    var aReturnData = [];
                    that.getView().setBusy(false);
                    let aData = JSON.parse(oRespData.results[0].Output);
                    var sReturnType = aData.e_return.type; // 
                    var sReturnMessage = aData.e_return.message; 
                    var sReturnTitle="";
                    var sIcon = MessageBox.Icon.NONE;
                        switch (sReturnType) {
                            case 'S':   //성공
                                sReturnTitle =  "Success"
                                sIcon = MessageBox.Icon.SUCCESS;
                                
                                MessageToast.show(sReturnMessage);
                                break;
                            case 'E':   //오류
                                sReturnTitle =  "Error"
                                sIcon = MessageBox.Icon.ERROR;
                                MessageBox.show(sReturnMessage, {
                                    icon: sIcon,
                                    title: sReturnTitle,
                                    actions: MessageBox.Action.OK,
                                    onClose: function (oAction) {
                                        if (oAction === 'OK') {
                                    
                                        }
                                    }
                                });
                                break;
                            default:
                                sIcon = MessageBox.Icon.NONE;
                                break;
                        }



                },
                error: function(oError) {
                  sap.m.MessageToast.show("["+oError.statusCode+"] "+oError.message);
                  oView.setBusy(false);
              }
            });

        }
      });
    }
  );
  