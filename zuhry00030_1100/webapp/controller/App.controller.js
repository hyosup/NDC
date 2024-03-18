/********************************************************************************************************
* Task ID       : [zuhry00030_1100]
* Task Desc     : [ANNUAL WAGE HISTORY]
* App ID        : com.hmmausa.myhmma.mypay.zuhry000301100
* App Desc      : [ANNUAL WAGE HISTORY]
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
  
      return BaseController.extend("com.hmmausa.myhmma.mypay.zuhry000301100.controller.App", {
        onInit: function() {
          const oView = this.getView();
          const oModelR = sap.ui.getCore().getModel('ROOT');
          oView.setModel(oModelR);
          oView.bindObject({ path: '/' });
          this.onSearch();
        },
        onSearch: function () {
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
          oModelO.read('/ZFHRY_ESS_GET_BASIC_PAY_1100Set', {
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
                              let mainData = oModelV.getProperty(oContext.getPath() + 'main');
                              oModelV.setProperty(oContext.getPath() + 'main', {
                                  ...mainData,
                                  list: aData.et_zess_emp_basic_pay
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
                  sap.m.MessageToast.show("["+oError.statusCode+"] "+oError.message);
                  oView.setBusy(false);
              },
          });
        }
      });
    }
  );
  