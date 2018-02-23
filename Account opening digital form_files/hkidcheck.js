function hkidValidate(hkID,hkIDExt){
				$("#notediv").remove();
				var json = {"A":1,"B":2,"C":3,"D":4,"E":5,"F":6,"G":7,"H":8,"I":9,"J":10,"K":11,"L":1,"M":2,"N":3,"O":4,"P":5,"Q":6,"R":7,"S":8,"T":9,"U":10,"V":11,"W":1,"X":2,"Y":3,"Z":4};
				var sum = 0;
				var regx1 = /^[A-Z]{1,1}\d{6,6}$/;
				var regx2 = /^[A-Z]{2,2}\d{6,6}$/;
				var hkIDRegx = /^[A-Z]{1,2}\d{6,6}$/;
				var hkIDExtregx = /^[0-9A-Z]{1,1}$/;

				if(hkIDRegx.test(hkID) && hkIDExtregx.test(hkIDExt)){

					var newHkID = hkID + hkIDExt;
					var hkIDArray = newHkID.split("").reverse();
					var length = hkIDArray.length;

					if(regx1.test(hkID)){

						for (i = 0; i < length;i++){

							if(i == 0 && hkIDArray[i] == "A"){
								hkIDArray[0] = 10;
							}
							if( i == length - 1){
								hkIDArray[i] = json[hkIDArray[i]];
							}

							sum += hkIDArray[i] * (i + 1);	
						}
					}

					if(regx2.test(hkID)){
						for (i = 0; i < length;i++){
							if(i == 0 && hkIDArray[i] == "A"){
								hkIDArray[0] = 10;
							}

							if( i == length - 1 || i == length - 2){
								hkIDArray[i] = json[hkIDArray[i]];
							}

							sum += hkIDArray[i] * (i + 1);
						}
					}

					if(sum % 11 != 0){
					    var html="";
						if(localStorage.getItem('locale')=="en-us")
						{
							html='<div id="notediv" class="control-error ng-scope has-error" ng-repeat="element in childrenElements" ng-init="hasError = (element.hasError)? hasError + 1: hasError " ng-if="element.messages.length > 0" ng-class="{ "has-error": element.hasError }" role="alert"><div class="control-description control-errors ng-scope" ng-if="hasError === 1"><div ng-repeat="error in element.messages" class="ng-scope"><i class="icon icon-circle-delete"></i><span class="description-body text-muted ng-binding" aria-label="Please input details in a valid format."> Please input details in a valid format.</span></div></div></div>';
						}else if(localStorage.getItem('locale')=="zh-cn")
						{
							html='<div id="notediv" class="control-error ng-scope has-error" ng-repeat="element in childrenElements" ng-init="hasError = (element.hasError)? hasError + 1: hasError " ng-if="element.messages.length > 0" ng-class="{ "has-error": element.hasError }" role="alert"><div class="control-description control-errors ng-scope" ng-if="hasError === 1"><div ng-repeat="error in element.messages" class="ng-scope"><i class="icon icon-circle-delete"></i><span class="description-body text-muted ng-binding" aria-label="请输入符合格式的资料。"> 请输入符合格式的资料。</span></div></div></div>';
						}else if(localStorage.getItem('locale')=="zh-hk")
						{
							html='<div id="notediv" class="control-error ng-scope has-error" ng-repeat="element in childrenElements" ng-init="hasError = (element.hasError)? hasError + 1: hasError " ng-if="element.messages.length > 0" ng-class="{ "has-error": element.hasError }" role="alert"><div class="control-description control-errors ng-scope" ng-if="hasError === 1"><div ng-repeat="error in element.messages" class="ng-scope"><i class="icon icon-circle-delete"></i><span class="description-body text-muted ng-binding" aria-label="請輸入符合格式的資料。"> 請輸入符合格式的資料。</span></div></div></div>';
						}
						angular.element($('input[name="ConnectedIndividual.hKIDExt"]')).parent().parent().parent().parent().parent().append(html);
					}else{
					  $("#notediv").remove();
					}
				}
}