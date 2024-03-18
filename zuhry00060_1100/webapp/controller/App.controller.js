/********************************************************************************************************
* Task ID       : [zuhry00060_1100]
* Task Desc     : [W2]
* App ID        : com.hmmausa.myhmma.mypay.zuhry000601100
* App Desc      : [W2]
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
  
      return BaseController.extend("com.hmmausa.myhmma.mypay.zuhry000601100.controller.App", {
        onInit: function() {
          const oView = this.getView();
          const oModelR = sap.ui.getCore().getModel('ROOT');
          oView.setModel(oModelR);
          oView.bindObject({ path: '/' });
          this.onSearch();
        },


        handleDetailsPress: function(oEvent) {
          // seleted data
          // https://stackoverflow.com/questions/52397325/sappui5-get-selected-item-from-table
          let seletedData = oEvent.getSource().getBindingContext().getObject();

          const oView = this.getView();
          const oContext = oView.getBindingContext();
          const oUserModel = oView.getModel('userModel');
          let oFilter = {
              i_info  : seletedData
            };
          // let oFilter = {
          //   i_info  : {
          //     PERNR : "00102811",
          //     SUBTY : "W2",
          //     OBJPS : "01",
          //     SPRPS : "",
          //     ENDDA : "99991231",
          //     BEGDA : "20220101",
          //     FORYEAR : "2022",
          //     TXCMP : "H201",
          //     RESTY : "W2",
          //     GENDATE :"20230123",
          //     RESTY_TXT : "",
          //     SEQNR : "00002",
          //     TFRCL : "A100",
          //     STATUS : "01",
          //     ALTTF : "",
          //     RESULT_IDX : "00001",
          //     GENTIME : "00:00:00",
          //     RUN_TYPE : "None",
          //     TXCMP_TXT : ""
          //   }
          // };
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
          oModelO.read('/ZFHRY_DISPLAY_W2_PDF_1100Set', {
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
                              let base64 = "base64 content";
                              let pdfWindow = window.open("");
      pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, " + aData.e_pdf + "'></iframe>");
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
                  oView.setBusy(false);
              },
              error: oError => {
                  sap.m.MessageToast.show("["+oError.statusCode+"] "+oError.message);
                  oView.setBusy(false);
              },
          });
          
        },
        
        onSearch: function () {
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
          /* Call GET_ENTITYSET with Filters */
          oModelO.read('/ZFHRY_GET_W2_INFO_1100Set', {
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
                                  list: aData.et_data
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
  