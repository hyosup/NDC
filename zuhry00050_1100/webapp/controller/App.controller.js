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
sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox",
        "sap/ui/core/Fragment"
    ],
    function(BaseController, MessageBox, Fragment) {
      "use strict";
  
      return BaseController.extend("com.hmmausa.myhmma.mypay.zuhry000501100.controller.App", {
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
// *&  I_TYPE--> D: Display, U:Update, C: Cancel by TM, P: Pending List  &*
// *&  #001  I_TYPE  = 'D' 인 경우  Display                              &*
// *&  #002  I_TYPE  = 'U' 인 경우  Update                               &*
// *&  #003  I_TYPE  = 'C' 인 경우  Cancel                               &*
// *&  #004  I_TYPE  = 'P' 인 경우  Pending List                         &*
          let oFilter = {
            i_type : 'D',
            i_pernr : oUserModel.getData().syUname, //사용자 아이디.
            i_taurt : 'FED' //사용자 아이디.
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
          oModelO.read('/ZFHRY_UPDATE_TAX_STATUS_1100Set', {
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
                                  list: aData.t_data,
                                  ename: aData.t_data[0].ename
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
        },



        /**
         * (Async) 목록-보기 Button 이벤트핸들러
         *	- 상세내역 팝업을 호출
        *
        * @param {sap.ui.base.Event} oEvent
        */
         onPressChg: async function (oEvent) {
          const oViewModel = this.getView().getModel();

          if (!this.pChangeDialog) {
            const oView = this.getView();
            this.pChangeDialog = await Fragment.load({
              id: oView.getId(),
              name: "com.hmmausa.myhmma.mypay.zuhry000501100.view.fragment.ZpayTaxFedChg",
              controller: this,
            });
            oView.addDependent(this.pChangeDialog);
          }

          this.pChangeDialog.open();
        },

        /**
         * 상세내역 팝업을-닫기 Button 이벤트핸들러
         *
         */
        onPressCloseDialog: function () {
          this.pChangeDialog.close();
        }
      });
    }
  );
  