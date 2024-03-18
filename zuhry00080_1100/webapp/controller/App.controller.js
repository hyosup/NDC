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
sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox",
        "sap/m/MessageToast"
    ],
    function(BaseController, MessageBox, MessageToast) {
      "use strict";
      return BaseController.extend("com.hmmausa.myhmma.mypay.zuhry000801100.controller.App", {

        onInit: function() {
          const oView = this.getView();
          const oModelR = sap.ui.getCore().getModel('ROOT');
          oView.setModel(oModelR);
          oView.bindObject({ path: '/' });
          this.onSearch();
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


        

        onInsert: function(){
          var that = this;
          var oView = this.getView();
          var oModel = this.getView().getModel();
          var it_idea = [{pernr:'', begda:'', endda:'', abgrd:'', UNAME:'', text1:'', event:''}];
          it_idea[0].pernr   = '00100242';
          it_idea[0].begda    = '2024/01/01';
          it_idea[0].endda   = '9999/12/31';
          it_idea[0].abgrd     = '2023/12/31';
          it_idea[0].UNAME    = '';
          it_idea[0].text1   = 'TEST';
          it_idea[0].event   = 'R';
          var objTbl = ["it_idea", "et_list"];
     
          // Input Data 설정
          var oData = {};
          oData.ptype = "U";
          oData.it_idea = it_idea;
          oData.pernr = '00100242';
          oData.begda = '20240101';
          oData.endda = '99991231';
          oData.abgrd = '20231231';
          oData.UNAME ='';
          oData.text1 ='TEST';
          oData.event ='R';

          // library.getRfcData(that, oView, "Z_OTC_IF6505", objTbl, oData, false);
          let RFC_CD = "ZFHRY_ESS_UPD_CAFE_ENROLL_1100";

          var oModelR = sap.ui.getCore().getModel('ROOT');
            oView.setModel(oModelR);
            oView.bindObject({ path: '/' + 'app' });    //View Name

            var oModel = that.getView().getModel();
            var oModelO = sap.ui.getCore().getModel('ODAT');
            var oFilter = {};// gateway로 보낼 조회조건
            var sEntity = RFC_CD;
            var sEntitySet = '/' + sEntity + 'Set';
            
            oData.login = oModel.getProperty('/app/login');
            // oFilter.input = JSON.stringify(oModel.getProperty('/app/login'));
            oFilter.input = JSON.stringify(oData);
            that.getView().setBusy(true);

            oModelO.read(sEntitySet, {  //'/Z_OTC_IF6500Set'
                async: false,
                filters: this.makeOdataFilter(oFilter),
                success: function (oDataI, response) { // 메세지를 받아오기 위해 response 추가
                    var aReturnData = [];
                    that.getView().setBusy(false);

                    // 결과
                    var ret = false;
                    if (oDataI.results.length > 0 && oDataI.results[0].output) {
                        // Return Data 처리
                        aReturnData = JSON.parse(oDataI.results[0].output);

                        if (aReturnData.es_return) {
                            var sIcon = MessageBox.Icon.NONE;
                            var sReturnType = aReturnData.es_return.mtype;
                        }

                        for (var i = 0; i < objTbl.length; i++) {
                            var tblNm = objTbl[i];
                            var RFC_DATA = [];
                            RFC_DATA = eval("aReturnData." + tblNm);

                            if(RFC_CD == "Z_OTC_IF6505" && tblNm == "et_list")
                            {
                                oModel.setProperty('/app/s_list', RFC_DATA); //검색에서 et_list를 사용
                            }
                            else
                            {
                                oModel.setProperty('/app/' + tblNm, RFC_DATA); //
                            }
                        }
                        ret = true;
                    }
                    that.getView().setBusy(false);
                    that.onCallback(oModel, RFC_CD, oData.ptype);
                },
                error: function(oEvent) {
                  that.getView().setBusy(false);
                  
                  var oMessage = JSON.parse(oEvent.responseText);
                  var sMessage = '';
                  if (oMessage.error.innererror.hasOwnProperty('errordetails')) {
                      oMessage.error.innererror.errordetails.forEach(function(oItem){
                          sMessage += oItem.message+'\n';
                      });
                  } else {
                      sMessage += oMessage.error.innererror.Error_Resolution.SAP_Transaction;
                  }
                  MessageBox.show(sMessage, {
                      icon: MessageBox.Icon.ERROR,
                      title:"Error",
                      actions: [MessageBox.Action.OK]
                  });
              }
            });
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
            oModelO.read('/ZFHRY_ESS_GET_CAFE_ENROLL_1100Set', {
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
                                    list: aData.et_enrollment_history,
                                    current_status: aData.current_status,
                                    chargesn: aData.chargesn,
                                    chargest: aData.chargest,
                                    paymentsn: aData.paymentsn,
                                    paymentst: aData.paymentst,
                                    datums: new Date(aData.datums),
                                    datume: new Date(aData.datume),
                                    balance: aData.balance,
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
  