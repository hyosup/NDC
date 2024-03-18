/********************************************************************************************************
* Task ID       : [zuhry00150_1100]
* Task Desc     : [BENEFIT OVERVIEW]
* App ID        : com.hmmausa.myhmma.mypay.zuhry001501100
* App Desc      : [BENEFIT OVERVIEW]
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
  
      return BaseController.extend("com.hmmausa.myhmma.mypay.zuhry001501100.controller.App", {
        onInit: function() {

          // https://jsbin.com/sasako/edit?html,js,output
          var oTabContainer = this.getView().byId("myTabContainer");
          oTabContainer.addEventDelegate({
            onAfterRendering: function() {
              var oTabStrip = this.getAggregation("_tabStrip");
              var oItems = oTabStrip.getItems();
              for (var i = 0; i < oItems.length; i++) {
                var oCloseButton = oItems[i].getAggregation("_closeButton");
                oCloseButton.setVisible(false);
              }
            }
          }, oTabContainer);

          const oView = this.getView();
          const oModelR = sap.ui.getCore().getModel('ROOT');
          oView.setModel(oModelR);
          oView.bindObject({ path: '/' });
          this.onHEALTHSearch();
          this.onINSURESearch();
          this.onSAVINGSSearch();
          
        },

        onHEALTHSearch: function () {
            const oView = this.getView();
            const oContext = oView.getBindingContext();
            const oUserModel = oView.getModel('userModel');
            let oFilter = {
                i_employee_number  : oUserModel.getData().syUname //사용자 아이디.
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
            /* Call GET_ENTITYSET with Filters */
            oModelO.read('/ZFHRY_ESS_GET_BEN_HEALTH_1100Set', {
                async: false,
                filters: aFilter,
                // success:  function(oRespData) {
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
                                let oModelV = oView.getModel();
                                let oContext = oView.getBindingContext();
                                let sampleData = oModelV.getProperty(oContext.getPath() + 'main');
                                oModelV.setProperty(oContext.getPath() + 'main', {
                                    ...sampleData,
                                    et_zess_emp_benefit_data: aData.et_zess_emp_benefit_data,
                                    et_zess_emp_benefit_data_dep: aData.et_zess_emp_benefit_data_dep
                                });
                                // MessageToast.show(sReturnMessage);
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
                    oView.setBusy(false);
                },
            });
        },
        onINSURESearch: function () {
          const oView = this.getView();
          const oContext = oView.getBindingContext();
          const oUserModel = oView.getModel('userModel');
          let oFilter = {
              i_employee_number  : oUserModel.getData().syUname //사용자 아이디.
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
          /* Call GET_ENTITYSET with Filters */
          oModelO.read('/ZFHRY_ESS_GET_BEN_INSURE_1100Set', {
              async: false,
              filters: aFilter,
              // success:  function(oRespData) {
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
                              let oModelV = oView.getModel();
                              let oContext = oView.getBindingContext();
                              let sampleData = oModelV.getProperty(oContext.getPath() + 'main');
                              oModelV.setProperty(oContext.getPath() + 'main', {
                                  ...sampleData,
                                  insu_benefit_data: aData.et_zess_emp_benefit_data,
                                  insu_list_item: aData.et_zess_emp_ben_data_insu_item
                              });
                              // MessageToast.show(sReturnMessage);
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
                  oView.setBusy(false);
              },
          });
        },
        onSAVINGSSearch: function () {
          const oView = this.getView();
          const oContext = oView.getBindingContext();
          const oUserModel = oView.getModel('userModel');
          let oFilter = {
              i_employee_number  : oUserModel.getData().syUname //사용자 아이디.
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
          /* Call GET_ENTITYSET with Filters */
          oModelO.read('/ZFHRY_ESS_GET_BEN_SAVINGS_1100Set', {
              async: false,
              filters: aFilter,
              // success:  function(oRespData) {
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
                              let oModelV = oView.getModel();
                              let oContext = oView.getBindingContext();
                              let sampleData = oModelV.getProperty(oContext.getPath() + 'main');
                              oModelV.setProperty(oContext.getPath() + 'main', {
                                  ...sampleData,
                                  save_benefit_data: aData.et_zess_emp_benefit_data,
                                  save_list_item: aData.et_zess_emp_ben_data_insu_item
                              });
                              // MessageToast.show(sReturnMessage);
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
                  oView.setBusy(false);
              },
          });
        }
      });
    }
  );
  