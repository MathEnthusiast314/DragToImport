// ==UserScript==
// @name        DragToImportObj
// @author      MathEnthusiast314
// @description Drag .obj file into the expressions bar to import
// @grant       none
// @match       https://www.desmos.com/calculator/zuisytxfgo
// @downloadURL https://github.com/MathEnthusiast314/DragToImport/blob/main/dragobj.user.js
// @updateURL https://github.com/MathEnthusiast314/DragToImport/blob/main/dragobj.user.js
// ==/UserScript==

//GRAPH: Works on https://www.desmos.com/calculator/zuisytxfgo
(function() {
    'use strict';

function start(){

	if (window.location.href.includes("desmos.com/calculator")) {
		if (typeof Calc != "undefined") {
            Calc.controller.dispatcher.register(obj=>{
                if (obj.type=='new-images'){
                    var file = obj.files[0];
                    var reader = new FileReader();
                    reader.readAsText(file);
                    reader.onload = function() {
                        var Objstring = reader.result
                        var regexv=/v ([-\d.]*) ([-\d.]*) ([-\d.]*)/gi
                        var resultv=Array.from(Objstring.matchAll(regexv))
                        var Setvertices=[1,2,3].map(function(i){return ({
                            "type": "expression",
                            "id": "v"+i,
                            "folderId": "43223",
                            "latex": "v_{0"+i+"}=\\left["+resultv.map(function Extract(num) {return num[i]})+"\\right]"
                        })})

                        var regexf=/f( (\d*)\/[\w/\d]*)( (\d*)\/[\w/\d]*)( (\d*)\/[\w/\d]*)( (\d*)\/[\w/\d]*)?( (\d*)\/[\w/\d]*)?( (\d*)\/[\w/\d]*)?( (\d*)\/[\w/\d]*)?( (\d*)\/[\w/\d]*)?( (\d*)\/[\w/\d]*)?( (\d*)\/[\w/\d]*)?/gi
                        var resultf=Array.from(Objstring.matchAll(regexf))
                        var Setfaces=[1,2,3,4,5,6,7,8,9,10].map(function(i){return ({
                            "type": "expression",
                            "id": "f"+i,
                            "folderId": "43223",
                            "latex": "f_{0"+i+"}=\\left["+resultf.map(function Extract(num) {if(num[2*i]==undefined){return '-1'}else{return num[2*i]}})+"\\right]"
                        })})

                        Calc.setExpressions(Setvertices)
                        Calc.setExpressions(Setfaces)
                        if (resultv.length>0){
                            Calc.controller.dispatcher.dispatch({"type": "toast/show","toast": {"message": ".OBJ successfully imported ✔️"}})
                        }

                    };
                }
            });
            console.log("DragToImportObj Loaded ✔️")
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
