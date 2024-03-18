sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/Fragment"
    ],
    function(BaseController, Fragment) {
      "use strict";
  
      return BaseController.extend("com.hmmausa.myhmma.myinfo.zuhrt000501100.controller.App", {
        onInit: function() {
        },

        onPressWindow: function (oEvent) {
          this.getView().getModel()
          const oViewModel = this.getView().getModel();
          const aConresnList = oViewModel.getProperty("/Currency"); // 사유 전체목록
          //alert(aConresnList)
          
          // https://ttowa.tistory.com/entry/CSS-%ED%8E%98%EC%9D%B4%EC%A7%80-%EB%82%B4-%ED%8A%B9%EC%A0%95-%EC%98%81%EC%97%AD%EB%A7%8C-print%ED%94%84%EB%A6%B0%ED%8A%B8-%ED%95%98%EA%B8%B0
          // https://code-study.tistory.com/43
          // 출처: https://ttowa.tistory.com/entry/CSS-페이지-내-특정-영역만-print프린트-하기 [Front-end 개발:티스토리]
          let htmlTagCss = '<style>'+
            '@media print {  table tr { -webkit-print-color-adjust:exact;}}'+
            '@media print { button, #sec_2{display:none} }'+            
            '</style>';


            // const oOptions = {};
            // const element1 = this.getView().byId("SAPUI5content").getDomRef();
            // await html2pdf().set(oOptions).from(element1).save();

          let htmlTagScriptPDF = '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>';

          // 출처: https://lisfe.tistory.com/680 [브이디자인 V 전주한옥마을닷컴:티스토리]
          let htmlTagScript = '<script>'+
            'function onPrint(){ window.print(); window.close(); }'+
            'function onHTMLPDF(){ '+
            '  const oOptions = {  margin: [0.3,1,0.5,1] }; '+ //top, left, buttom, right,
            // '  const elementHTML = document.body; '+
            '  const elementHTML = document.getElementById("pdf_canvas");'+
            '  html2pdf().set(oOptions).from(elementHTML).save(); '+
            '}'+
            '</script>';
         
          let htmlTagButton = 
          '<button type="button" style="float: right;" onclick="onPrint()")">Print</button>&nbsp;<button type="button" style="float: right;" onclick="onHTMLPDF()")">PDF</button>';

          let startHTML='<div id="pdf_canvas">';
        
          let htmlTagP = '<p>';

          let htmlTag2 = 
          '<img  class="fit-picture" src="/img/Award.JPG" alt="Grapefruit slice atop a pile of other slices" />';
        
            
          let endHTML='</div>';
            



          var sTargetContent = htmlTagCss+startHTML+htmlTagP+htmlTagP+htmlTag2+htmlTagP+htmlTagP+htmlTagP+endHTML;
              
          //var w = window.open();
          // 사이즈 지정해서 열기, 그냥 열면 탭으로 열림.
          // https://ssd0908.tistory.com/entry/JavaScript-windowopen-%EC%83%88%EC%B0%BD%EC%9C%BC%EB%A1%9C-%EC%97%B4%EA%B8%B0-%EC%82%AC%EC%9A%A9%EB%B2%95
          var w = window.open("", "_blank", "width=900, height=900");

          var printOne = sTargetContent; // 프린트 될 섹션
          w.document.write('<html><head><title>Perfect Attendance</title><style>'+htmlTagCss+'</style>'+htmlTagScriptPDF+htmlTagScript+'</head><body >' + printOne + '</body></html>');
          w.document.close();
          //w.window.print();
        }
      });
    }
  );
  