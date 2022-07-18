// ==UserScript==
// @name        DragToImportRle
// @author      MathEnthusiast314
// @description Drag .rle file into the expressions bar to import
// @grant       none
// @version     1.0
// @match       https://www.desmos.com/calculator/oiangej86h
// @downloadURL https://github.com/MathEnthusiast314/DragToImport/blob/main/dragrle.user.js
// @updateURL https://github.com/MathEnthusiast314/DragToImport/blob/main/dragrle.user.js
// ==/UserScript==

//GRAPH: Works on https://www.desmos.com/calculator/oiangej86h
(function() {
    'use strict';

function importRle(RLE){
    RLE = RLE.replace(/\r\n/g,'\n')
    var pattern = `rule = (?:B|b)([0-9]*)/(?:S|s)([0-9]*)\n([\\s\\S]*)`
    var match0 = RLE.match(pattern);
    if (match0 != null) {
        var rle = match0[3];
        rle = rle.replace(/(?<![0-9])([bo$])/g, '1$1')
        var rleData = rle.split("$")
        var rleData2 = [];
        for (var i = 0; i < rleData.length; i++) {
            rleData2.push((rleData[i].match(/[0-9]*[bo]/g)));
        }
        var rleData3 = []
        for (var j = 0; j < rleData2.length; j++) {
            rleData3.push([]);
            if (rleData2[j] != null) {
                for (var k = 0; k < rleData2[j].length; k++) {
                    rleData3[j] = rleData3[j].concat(Array(Number((rleData2[j][k]).substring(0, (rleData2[j][k]).length - 1))).fill((rleData2[j][k]).substring((rleData2[j][k]).length - 1, (rleData2[j][k]).length)));
                }
            }
        }
        var list = "L_{000}=\\left["
        var ycoord = 0
        for (var l = 0; l < rleData3.length; l++) {
            for (var m = 0; m < rleData3[l].length; m++) {
                if (rleData3[l][m] == "o") {
                    list = list + ("\\left(" + m + "," + (-ycoord) + "\\right),");
                }
            }
            var tempo = rleData[l].match(/[0-9]{1,}/g);
            ycoord = ycoord + Number(tempo[tempo.length - 1]);
        }
        list = list.substring(0, list.length - 1) + "\\right]";
        Calc.setExpression({
            id: 'born',
            latex: `V_{ariantB}=\\left[${match0[1].split('').join(',')}\\right]`
        })
        Calc.setExpression({
            id: 'survive',
            latex: `V_{ariantS}=\\left[${match0[2].split('').join(',')}\\right]`
        })
        Calc.setExpression({
            id: 'initial',
            latex: list
        });
        Calc.setExpression({
            id: 'state',
            latex: "L=\\left[\\left(0,0\\right)\\right]"
        })
        console.log('Imported ✔️');
        Calc.controller.dispatcher.dispatch({"type": "toast/show","toast": {"message": ".rle successfully imported ✔️"}})
    }
}

function start(){

	if (window.location.href.includes("desmos.com/calculator")) {
		if (typeof Calc != "undefined") {
            document.onpaste = function(e) {
                var pasted = e.clipboardData.getData('Text');
                importRle(pasted);
            }
            Calc.controller.dispatcher.register(obj=>{
                if (obj.type=='new-images'){
                    var file = obj.files[0];
                    var reader = new FileReader();
                    reader.readAsText(file);
                    reader.onload = function() {
                        var RLE = reader.result;
                        importRle(RLE);

                    };
                }
            });
            console.log("DragToImportRle Loaded ✔️")
		} else {
			window.alert("uh oh, something went wrong")
			}
	} else {
		window.alert("this only works on desmos.com/calculator :v")
		}
}
function tryStart(){
	  if (window.Calc !== undefined) {
	    	start();
	  } else {
	    	setTimeout(tryStart, 50)
	  }
}
tryStart();
})();
