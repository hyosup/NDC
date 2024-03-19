/********************************************************************************************************
* Task ID       : [zuhry00180_1100]
* Task Desc     : [401K WORKSHOP SIGNUP]
* App ID        : com.hmmausa.myhmma.mypay.zuhry001801100
* App Desc      : [401K WORKSHOP SIGNUP]
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
        "sap/m/MessageToast",
        "sap/ui/core/Fragment"
    ],
    function(BaseController, MessageBox, MessageToast, Fragment) {
      "use strict";
  
      return BaseController.extend("com.hmmausa.myhmma.mypay.zuhry001801100.controller.App", {
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
            i_pernr  : oUserModel.getData().syUname, //사용자 아이디.
            i_type   : "L",
            i_event_type  : "4K",
            i_event_id    : "",
            i_signup_date :"20190816",
            i_acknowledged : "",
            i_addi_attendee : "",
            i_addi_attendee_ename : ""
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
          var that = this;
          /* Call GET_ENTITYSET with Filters */
          oModelO.read('/ZFHRY_ESS_EVENT_SIGNUP_1100Set', {
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
                                  et_data: aData.et_data
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
  