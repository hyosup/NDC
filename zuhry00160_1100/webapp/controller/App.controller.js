/********************************************************************************************************
* Task ID       : [zuhry00160_1100]
* Task Desc     : [TOTAL COPMENSATION]
* App ID        : com.hmmausa.myhmma.mypay.zuhry001601100
* App Desc      : [TOTAL COPMENSATION]
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
  
      return BaseController.extend("com.hmmausa.myhmma.mypay.zuhry001601100.controller.App", {
        onInit: function() {

          const oView = this.getView();
          const oModelR = sap.ui.getCore().getModel('ROOT');
          oView.setModel(oModelR);
          oView.bindObject({ path: '/' });
          


        },
        onAfterRendering: function() {
          //  this.getView().byId("idHTMLContent");
          //  this.pSummaryHTMLDialog.close();
        },


        
        onSearch: function () {
          const oView = this.getView();
          const oContext = oView.getBindingContext();
          const oUserModel = oView.getModel('userModel');
          let oFilter = {
            i_pernr  : oUserModel.getData().syUname, //사용자 아이디.
            i_begda  : '20230101',
            i_endda  : '20230131'
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
          oModelO.read('/ZFHRY_ESS_GET_TCS_1100Set', {
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
                                  e_tot_direct: aData.e_tot_direct,
                                  e_tot_indirect: aData.e_tot_indirect
                              });
                              // MessageToast.show(sReturnMessage);
                              that.onPressWindow();
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
         
        /**
         * (Async) 목록-보기 Button 이벤트핸들러
         *	- Summary 내역 팝업을 호출
        *
        * @param {sap.ui.base.Event} oEvent
        */
         onPressPaySummary: async function (oEvent) {
          const oViewModel = this.getView().getModel();
          // const mSelectedRowData = oEvent.getSource().getParent().getParent().getBindingContext().getObject();
          // oViewModel.setProperty("/detail", { ...mSelectedRowData });
         
          if (!this.pSummaryDialog) {
            const oView = this.getView();
           
            this.pSummaryDialog = await Fragment.load({
              id: oView.getId(),
              name: "com.hmmausa.myhmma.mypay.zuhry000201100.view.fragment.PaySummaryDialog",
              controller: this,
            });
            oView.addDependent(this.pSummaryDialog);
          }

          this.pSummaryDialog.open();
        },

        onPressWindow: function (oEvent) {
          const oViewModel = this.getView().getModel();
          var aConresnList, aConresnList;
            aConresnList =  oViewModel.getProperty("/main/e_tot_direct"); // Company Address



          
          
          //alert(aConresnList)
          
          // https://ttowa.tistory.com/entry/CSS-%ED%8E%98%EC%9D%B4%EC%A7%80-%EB%82%B4-%ED%8A%B9%EC%A0%95-%EC%98%81%EC%97%AD%EB%A7%8C-print%ED%94%84%EB%A6%B0%ED%8A%B8-%ED%95%98%EA%B8%B0
          // https://code-study.tistory.com/43
          // 출처: https://ttowa.tistory.com/entry/CSS-페이지-내-특정-영역만-print프린트-하기 [Front-end 개발:티스토리]
          let htmlTagCss = '<style>'+
            '@media print {  table tr { -webkit-print-color-adjust:exact;}}'+
            '@media print { button, #sec_2{display:none} }'+            
            'svg { width: 100%; height: 100%;}'+
            'path.slice{ stroke-width:2px; }'+
            'polyline{ opacity: .3; stroke: black; stroke-width: 2px;fill: none;}'+
            '</style>';

            // const oOptions = {};
            // const element1 = this.getView().byId("SAPUI5content").getDomRef();
            // await html2pdf().set(oOptions).from(element1).save();

          let htmlTagScriptPDF = '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>';

          let htmlTagScriptChart = '<script src="http://d3js.org/d3.v3.min.js" ></script>'+
                                   '<script src="/lib/d3Chart.js" ></script>';
        

  // https://www.devkuma.com/docs/d3-js/pie-chart/
  // https://gist.github.com/dbuezas/9306799
        let htmlTagScriptChart2 ='<script>'+
          ' var dataset = [{ "name": "", "value": 25 },{ "name": "", "value": 75 }];'+
          ' var width = 300;'+
          ' var height = 150;'+
          ' var radius = Math.min(width, height) / 2 - 10;'+
          ' var svg = d3.select("#content").append("svg").attr("width", width).attr("height", height); '+
          ' var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"); '+
          ' var color = d3.scaleOrdinal().range(["#717173", "#004183"]); '+
          ' var pie = d3.pie().value(function(d) { return d.value; }).sort(null); '+
          ' var pieGroup = g.selectAll(".pie").data(pie(dataset)).enter().append("g").attr("class", "pie"); '+
          ' var arc = d3.arc().outerRadius(radius).innerRadius(0); '+
          ' pieGroup.append("path").attr("d", arc).attr("fill", function(d) { return color(d.index) }).attr("opacity", 0.75).attr("stroke", "white");' +
          ' var text = d3.arc().outerRadius(radius - 30).innerRadius(radius - 30);'+
          ' pieGroup.append("text").attr("fill", "black").attr("transform", function(d) { return "translate(" + text.centroid(d) + ")"; }).attr("dy", "5px").attr("font", "10px").attr("text-anchor", "middle").text(function(d) { return d.data.name; });'+
          ' </script>';





          // 출처: https://lisfe.tistory.com/680 [브이디자인 V 전주한옥마을닷컴:티스토리]
          let htmlTagScript = '<script>'+
            'function onPrint(){ window.print(); window.close(); }'+
            'function onHTMLPDF(){ '+
            //'  const oOptions = {  margin: [0.3,1,0.5,1] }; '+ //top, left, buttom, right,
             '  const oOptions = {  filename: "TOTAL COMPENSATION.pdf", margin: [0.3,1,0.5,1], jsPDF: {format:[300,300]} }; '+ 
            // '  const elementHTML = document.body; '+
            '  const elementHTML = document.getElementById("pdf_canvas");'+
            '  html2pdf().set(oOptions).from(elementHTML).save(); '+
            '}'+
            '</script>';


         

          let htmlTagButton = 
          '<button type="button" style="float: left;" onclick="onPrint()")">Print</button>&nbsp;<button type="button" style="float: left;" onclick="onHTMLPDF()")">PDF</button>';

          let startHTML='<div id="pdf_canvas" width="100%">';
          let htmlTag = 
          '<table width="100%" style="border:1px solid black; border-collapse:collapse">'+
            '<tr>'+
            '   <td width="25%" style="border:1px solid black;" bgcolor="#F5F5F5">Team Member Nuumber</td>'+
            '   <td width="25%" style="border:1px solid black;" bgcolor="">'+aConresnList+'</td>'+
            '   <td width="25%" style="border:1px solid black;" bgcolor="#F5F5F5">Hire Date</td>'+
            '   <td width="25%" style="border:1px solid black;" bgcolor="">'+aConresnList+'</td>'+
            ' </tr>'+
            '<tr>'+
            '   <td style="border:1px solid black;" bgcolor="#F5F5F5">Classification/td>'+
            '   <td style="border:1px solid black;" bgcolor="">'+aConresnList+'</td>'+
            '   <td style="border:1px solid black;" bgcolor="#F5F5F5">Statement Period</td>'+
            '   <td style="border:1px solid black;" bgcolor="">'+aConresnList+'</td>'+
            ' </tr>'+
            '<tr>'+
            '   <td colspan="4">333</td>'+
            ' </tr>'+
            '<tr>'+
            '   <td colspan="2" style="border:1px solid black;" bgcolor="" >22</td>'+
            '   <td colspan="2" style="border:1px solid black;" bgcolor="" >33</td>'+
            ' </tr>'+
            '<tr>'+
            '   <td colspan="4">444</td>'+
            ' </tr>'+
            '<tr>'+
            '   <td colspan="4">444</td>'+
            ' </tr>'+
            '</table>';
            let htmlTagP = '<p>';

            let htmlTag2 = 
            '<table width="100%" style="border:1px solid black; border-collapse:collapse">'+
              '<tr >'+
              '   <td colspan="3" style="border:1px solid black;" bgcolor="#E8F3F8" >Total Compensaction Package : $</td>'+
              ' </tr>'+
              ' <tr>'+
              '   <td width="50%" style="border:1px solid black; bgcolor="#F5F5F5"">Direct Pay</td>'+
              '   <td width="25%" style="border:1px solid black;">$</td>'+
              '   <td width="28%" style="border:1px solid black;  bgcolor="#F5F5F5"">75%</td>'+
              ' </tr>'+
              ' <tr >'+
              '   <td style="border:1px solid black; bgcolor="#F5F5F5"">Health, Insurance, Disablility, Social Security & Medicare</td>'+
              '   <td style="border:1px solid black;">$</td>'+
              '   <td style="border:1px solid black;  bgcolor="#F5F5F5"">25%</td>'+
              ' </tr>'+
              '</table>';
             let htmlTag3 = 
              '<table width="100%" style="border:1px solid black; border-collapse:collapse">'+
                '<tr >'+
                '   <td width="60%">Dear Christoeper weihe,<br>'+  
                '     In an effort to broaden your undrstanding of the salary and denefit plans offered by HMMA, <br>'+  
                '     we are providing you an Annual Total Compensation Statement.,<br>'+  
                '     This document, outlineds your personal compensation and benefits for calendar year 2022.<br><br>'+  
                '     This information below details the competitive and comprehensive compensation and benefits package HMMA offers its values team Members.<br>'+  
                '     Every effort has been made to prepare an accurate Total Compensation Statement.<br>'+  
                '     Please review this report carefully: oyu will notice total compensation is much more than your base salary...<br>'+  
                '     <br>'+  
                '     Sincerely,'+  
                '     <br>'+  
                '     Human Resource Department'+  
                '   </td>'+  
                '   <td align="center"><div id="content" height=""></div></td>'+
                ' </tr>'+
                '</table>';
          
                let htmlTag6 = 
                '<table width="100%" style="border:1px solid black; border-collapse:collapse">'+
                  '<tr >'+
                  '   <td colspan="3" style="border:1px solid black;" bgcolor="#E8F3F8" >Direct Pay : $</td>'+
                  ' </tr>'+
                  ' <tr>'+
                  '   <td width="50%" style="border:1px solid black; bgcolor="#F5F5F5"">Direct Pay</td>'+
                  '   <td width="25%" style="border:1px solid black;">$</td>'+
                  '   <td width="28%" style="border:1px solid black;  bgcolor="#F5F5F5"">75%</td>'+
                  ' </tr>'+
                  ' <tr >'+
                  '   <td style="border:1px solid black; bgcolor="#F5F5F5"">Health, Insurance, Disablility, Social Security & Medicare</td>'+
                  '   <td style="border:1px solid black;">$</td>'+
                  '   <td style="border:1px solid black;  bgcolor="#F5F5F5"">25%</td>'+
                  ' </tr>'+
                  '</table>';


          let endHTML='</div>';


          var sTargetContent = htmlTagCss+htmlTagButton+startHTML+htmlTagP+htmlTag+htmlTagP+htmlTag2+htmlTagP+htmlTagP+htmlTagP+htmlTag3+htmlTagP+htmlTag6+endHTML;
              
          //var w = window.open();
          // 사이즈 지정해서 열기, 그냥 열면 탭으로 열림.
          // https://ssd0908.tistory.com/entry/JavaScript-windowopen-%EC%83%88%EC%B0%BD%EC%9C%BC%EB%A1%9C-%EC%97%B4%EA%B8%B0-%EC%82%AC%EC%9A%A9%EB%B2%95
          var w = window.open("", "_blank", "width=1400, height=800");

          var printOne = sTargetContent; // 프린트 될 섹션
          w.document.write('<html><head><title>Pay Slip</title><style>'+htmlTagCss+'</style>'+htmlTagScriptPDF+htmlTagScript+'</head><body>'+ printOne + '</body></html>'+htmlTagScriptChart);
          w.document.close();
          //w.window.print();
        },

        // onPressPaySummaryHTML: async function (oEvent) {
         
        //   // var fragmentId = this.getView().createId("fr1");
        //   // var tab = this.getView().byId("fr1", "idHTMLContent");

        //   if (!this.pSummaryHTMLDialog) {
        //     const oView = this.getView();

            
        //     this.pSummaryHTMLDialog = await Fragment.load({
        //       //id: oView.getId(), 
        //       id : "fr1",// 아이디 지정.
        //       name: "com.hmmausa.myhmma.mypay.zuhry000201100.view.fragment.PaySummaryHTMLDialog",
        //       controller: this
        //     });
        //     oView.addDependent(this.pSummaryHTMLDialog);
        //   }

        //   this.pSummaryHTMLDialog.open();

        //   let htmlTagCss = '<style>'+
        //     '.uoBGPrint { bgcolor : "#ECFCEB" }    '+
        //     '</style>';
         
        //   let htmlTag = 
        //   '<table width="100%" style="border:1px solid black; border-collapse:collapse">'+
        //     '<thead style="border:1px solid black;">'+
        //     '<tr>'+
        //     '   <td rowspan="3" style="border:1px solid black; text-align:center;" bgcolor="#ECFCEB" >Hyundai Motor <br>Manufacturing Alabam<br>700 Hyundai Boulevard<br>Montgomery, AL 36105<br></td>'+
        //     '   <td width="20%" style="border:1px solid black;" bgcolor="#F5F5F5">Check#</td>'+
        //     '   <td width="20%" style="border:1px solid black;" bgcolor="">001C</td>'+
        //     ' </tr>'+
        //     ' <tr>'+
        //     '   <td style="border:1px solid black;" bgcolor="#F5F5F5">Check Date</td>'+
        //     '   <td style="border:1px solid black;">11/27/2024</td>'+
        //     ' </tr>'+
        //     ' <tr >'+
        //     '   <td style="border:1px solid black;" bgcolor="#F5F5F5">Pay Period</td>'+
        //     '   <td style="border:1px solid black;">10/27/2024~11/27/2024</td>'+
        //     ' </tr>'+
        //     '</thead>'+
        //     '</table>';
        //     let htmlTagP = '<p>';

        //     let htmlTag2 = 
        //     '<table width="100%" style="border:1px solid black; border-collapse:collapse">'+
        //       '<thead style="border:1px solid black;">'+
        //       '<tr >'+
        //       '   <td width="40%" rowspan="3" style="border:1px solid black;" bgcolor="#E8F3F8" >Mr. Christoper Dean<br>James Dean <br>Prattville 36067</td>'+
        //       '   <td style="border:1px solid black;" class="uoBGPrint">Employee#</td>'+
        //       '   <td colspan="3"  style="border:1px solid black;"></td>'+
        //       ' </tr>'+
        //       ' <tr>'+
        //       '   <td width="15%" style="border:1px solid black;">FED</td>'+
        //       '   <td width="15%" style="border:1px solid black;">33</td>'+
        //       '   <td width="15%" style="border:1px solid black;">FED</td>'+
        //       '   <td width="15%" style="border:1px solid black;">33</td>'+
        //       ' </tr>'+
        //       ' <tr >'+
        //       '   <td style="border:1px solid black;">AL</td>'+
        //       '   <td style="border:1px solid black;">55</td>'+
        //       '   <td style="border:1px solid black;">FED</td>'+
        //       '   <td style="border:1px solid black;">33</td>'+
        //       ' </tr>'+
        //       '</thead>'+
        //       '</table>';

        //   //************ */ 4 ways to get controls inside a Fragment
        //   // https://community.sap.com/t5/technology-blogs-by-members/4-ways-to-get-controls-inside-a-fragment/ba-p/13468170
        //   sap.ui.getCore().byId("fr1--idHTMLContentTable").setContent('<div>'+htmlTag+htmlTagP+htmlTag2+'</div>')

        // },

        // onPressPaySummaryHTML111: async function (oEvent) {
         
        //   //let idHTMLContent = this.byId(sap.ui.core.Fragment.createId("fr1", "idHTMLContent"));// HTML Content
        //   //let idHTMLContent = sap.ui.core.Fragment.createId("fr1", "idHTMLContent");// HTML Content
          
        //   // Fragment에 Contens가 안바뀌네요.~~~??????????물어봐야됨. --> sap.ui.getCore().byId 활용함.
        //   var fragmentId = this.getView().createId("fr1");
        //   var tab = Fragment.byId(fragmentId, "idHTMLContent");
        //   tab.setContent('&lt;div class=&quot;content&quot;&gt;&lt;h4&gt;LoIpsum ...&lt;/a&gt;&lt;/div&gt;');

        //   if (!this.pSummaryHTMLDialog) {
        //     const oView = this.getView();

            
        //     this.pSummaryHTMLDialog = await Fragment.load({
        //       //id: oView.getId(),
        //       id : "fr1",
        //       name: "com.hmmausa.myhmma.mypay.zuhry000201100.view.fragment.PaySummaryHTMLDialog",
        //       controller: this,
        //     });
        //     oView.addDependent(this.pSummaryHTMLDialog);
        //   }

        //   this.pSummaryHTMLDialog.open();

        // },


        onPrint: function(){
          // 프린트 이후 이벤트가 발생안됨.
          // var oTarget =  sap.ui.getCore().byId("fr1--idHTMLContentTable");

          //  var $domTarget = oTarget.$()[0],
          //       sTargetContent = $domTarget.innerHTML,
          //       sOriginalContent = document.body.innerHTML;
                
          //   document.body.innerHTML = sTargetContent;
          //   window.print();
          //   document.body.innerHTML = sOriginalContent;

          // 출처: https://fimtrus.tistory.com/entry/Web-windowprint-로-원하는-영역-인쇄하기 [Lv.Max 를 꿈꾸는 개발자 블로그:티스토리]
          // var popupWindow = window.open("", "_blank" );

          // popupWindow.document.write( "<head>"); //head 제대로 쓰니까..티스토리 에러가...
          // popupWindow.document.write( $('head').html() );
          // popupWindow.document.write( '</head>' ); 


          //  var oTarget =  sap.ui.getCore().byId("fr1--idHTMLContentTable");

          //  var $domTarget = oTarget.$()[0],
          //       sTargetContent = $domTarget.innerHTML,
          //       sOriginalContent = document.body.innerHTML;
                
          //   document.body.innerHTML = sTargetContent;
          // var $table = sTargetContent;

          //   popupWindow.document.write( '<body>' );
          //   popupWindow.document.write( '' );
          //   popupWindow.document.write( sTargetContent );
          //   popupWindow.document.write( '</body>' );
           
          //   popupWindow.print();

          // https://blog.naver.com/kwhong11/221693154726
           var oTarget =  sap.ui.getCore().byId("fr1--idHTMLContentTable");

           var $domTarget = oTarget.$()[0],
                sTargetContent = $domTarget.innerHTML,
                sOriginalContent = document.body.innerHTML;
                
           var w = window.open();
            var printOne = sTargetContent; // 프린트 될 섹션
            w.document.write('<html><head><style></style></head><body>' + printOne + '</body></html>');
            w.document.close();
            w.window.print();
        },

        onPdfPrintSAPUI5: async function(){
          const oOptions = {};
          const element1 = this.getView().byId("SAPUI5content").getDomRef();
          await html2pdf().set(oOptions).from(element1).save();
        },
        

        onPdfPrint: async function(){
            //this.getView().getModel("settings").setProperty("/visible", false);
        
            // const oOptions = {
            //     margin: [0.3,0,0.5,0],
            //     filename:     'testing-pdf-print-nathan.pdf',
            //     image:        { type: 'jpeg', quality: 0.98 },
            //     html2canvas:  { scale: 1 },
            //     jsPDF:        { unit: 'in', format: 'letter', orientation: 'l' },
            //     pagebreak: { avoid: 'tr' }
            // };
            
            const oOptions = {};

            // const oOptions = {
            //     margin: [0.3,0,0.5,0],
            //     filename:     'testing-pdf-print-nathan.pdf',
            //     image:        { type: 'jpeg', quality: 1.98 }
            // };
        
            //const element1 = this.getView().byId("SAPUI5contentB").getDomRef();
            const element1 = sap.ui.getCore().byId("fr1--idHTMLContentTable").getDomRef();
            
        
            await html2pdf().set(oOptions).from(element1).save();
        
            //this.getView().getModel("settings").setProperty("/visible", true);
        },


        /**
         * Summary 내역 팝업을-닫기 Button 이벤트핸들러
         *
        */
        onPressCloseDialog: function () {
          this.pSummaryDialog.close();
        },
        onPressHTMLCloseDialog: function () {
          this.pSummaryHTMLDialog.close();
        }

      });
    }
  );
  