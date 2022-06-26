// ==UserScript==
// @name        DragToImport
// @author      MathEnthusiast314
// @description Drag .json file into the expressions bar to import the graph
// @grant       none
// @match       https://*.desmos.com/calculator*
// @downloadURL https://github.com/MathEnthusiast314/DragToImport/blob/main/drag.user.js
// @updateURL https://github.com/MathEnthusiast314/DragToImport/blob/main/drag.user.js
// ==/UserScript==

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
                        Calc.setState(JSON.parse(reader.result));

                    };
                }
            });
            console.log("DragToImport Loaded ✔️")
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
