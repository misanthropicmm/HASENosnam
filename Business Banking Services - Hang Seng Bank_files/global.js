/* new for Public Website Revamp start */
var samePromeList = [];
function loadMenuConfig(){
	jQuery.ajax({
		type: "GET",
		url: "/1/PA_1_2_S5/content/application_resources/menuitem/config.xml",
		data: {}
	})
	.done(function(msg){
		jQuery(msg).find("item").each(function(a,b){
			var sameFlag = jQuery(b).attr("same");
			var menuName = jQuery(b).attr("name");
			if(sameFlag=="Y"){
				samePromeList.push(menuName);
				for(var i=0;i<3;i++){
					var promo = jQuery("div[ref='"+menuName+"']").find(".rvp_thm_SubSubMenuItem").find("div:eq("+i+")").filter(".rvp_thm_promo");
					var data_src = promo.attr("data-src");
					if(data_src){
						var data_src_new = data_src.replace("_item1","_item1");
						promo.attr("data-src",data_src_new);
					}
				}
			}
		});
	})
}

function loadPromoLink(array){
	jQuery(array).each(function(i,e){
		jQuery.ajax({
			type: "GET",
			url: e.url,
			data: {}
		})
		.done(function(msg){
			jQuery("#"+e.id).html(msg);
		})
		.fail(function(msg){
			jQuery("#"+e.id).html("");
		});	
	});
}

function searchScope(url){
	jQuery.ajax({
			type: "GET",
			url: url,
			data: {}
		})
		.done(function(msg){
			var ind1=msg.indexOf("search.group.1");
			var ind2=msg.indexOf("group.search.msg");
			var newMsg=msg.substring(ind1,ind2);
			var arr=newMsg.split("search.group");
			var optionStr = '';
			for(var i=1;i<arr.length;i++){
				var value=trim(arr[i].replace('.'+i+'=',''));
				if(value.indexOf("\\u")!= -1){
					value=Utf8ToWords(value);
				}
				optionStr+='<option value="'+i+'">'+value+'</option>';	
			}
			jQuery('#scope').append(optionStr);
		})
}

function Utf8ToWords(cc) {
	var regexp = new RegExp("(\\\\u([a-zA-Z0-9]{4}))");
	while(regexp.test(cc)) {
		var tmpVar = regexp.exec(cc); 
		cc = cc.replace(tmpVar[1], "&#"+ parseInt("0x" + tmpVar[2]) + ";");
	}
	return  cc.toString();
}

var logonWin;
function personal_ebank(type,webTrend){
	if(type == "cn"){
		if (!logonWin || logonWin.closed) {
		} else {
			var flag = confirm("\u9601\u4E0B\u662F\u5426\u786E\u5B9A\u5173\u95ED\u73B0\u6709\u7684e-Banking\u89C6\u7A97\u4EE5\u91CD\u65B0\u767B\u5165?");
			if (flag) {
				logonWin.close();				
			} else {
				return;
			}
		} 
		logonWin = window.open("https://e-banking.hangseng.com/1/2/logon?language=zh_CN&WT.ac="+webTrend,"EBankTopFrame","width=1024,height=768,top=0,left=0,status=no,scrollbars=yes,toolbar=no,location=no,menubar=no,resizable=yes");
	}else if(type == "zh"){
		if(!logonWin || logonWin.closed) {
		} else {
			var flag = confirm("\u95A3\u4E0B\u662F\u5426\u78BA\u5B9A\u95DC\u9589\u73FE\u6709\u7684e-banking\u8996\u7A97\u4EE5\u91CD\u65B0\u767B\u5165?");
			if (flag) {
				logonWin.close();				
			} else {
				return;
			}
		} 
		logonWin = window.open("https://e-banking.hangseng.com/1/2/logon?language=zh&WT.ac="+webTrend,"EBankTopFrame","width=1024,height=768,top=0,left=0,status=no,scrollbars=yes,toolbar=no,location=no,menubar=no,resizable=yes");
	}else{
		if(!logonWin || logonWin.closed) {
		} else {
			var flag = confirm("Are you sure to close your existing e-banking browser and logon again?");
			if (flag) {
				logonWin.close();				
			} else {
				return;
			}
		} 
		logonWin = window.open("https://e-banking.hangseng.com/1/2/logon?language=en&WT.ac="+webTrend,"EBankTopFrame","width=1024,height=768,top=0,left=0,status=no,scrollbars=yes,toolbar=no,location=no,menubar=no,resizable=yes");
	}	
}

function business_ebank(type,webTrend) {
	if(type=="zh"){
		window.open('https://ebusiness.hangseng.com/1/2/?idv_cmd=idv.Authentication&nextPage=b2g.hase.launching&__targetLocale=zh_HK&WT.ac='+webTrend,'haseb2gmain','top=5,left=5,width=800,height=600,scrollbars=1,status=1,resizable=1');
	}else if(type=="cn"){
		window.open('https://ebusiness.hangseng.com/1/2/?idv_cmd=idv.Authentication&nextPage=b2g.hase.launching&__targetLocale=zh_CN&WT.ac='+webTrend,'haseb2gmain','top=5,left=5,width=800,height=600,scrollbars=1,status=1,resizable=1');
	}else{
		window.open('https://ebusiness.hangseng.com/1/2/?idv_cmd=idv.Authentication&nextPage=b2g.hase.launching&__targetLocale=en&WT.ac='+webTrend,'haseb2gmain','top=5,left=5,width=800,height=600,scrollbars=1,status=1,resizable=1');
	}
}

function hsbcnet(type,webTrend){
	if(type=="zh"){
		window.open('http://www.hangseng.com/cms/sidnet/files/hsbcnet/chi/hkform.html?WT.ac='+webTrend,'','top=5,left=5,width=1024,height=768,scrollbars=1,status=1');
	}else if(type=="cn"){
		window.open('http://www.hangseng.com/cms/sidnet/files/hsbcnet/schi/hkform.html?WT.ac='+webTrend,'','top=5,left=5,width=1024,height=768,scrollbars=1,status=1');
	}else{
		window.open('http://www.hangseng.com/cms/sidnet/files/hsbcnet/eng/hkform.html?WT.ac='+webTrend,'','top=5,left=5,width=1024,height=768,scrollbars=1,status=1');
	}
	
}

function ebank_register(type) {
	if(type=="zh"){
		window.open("https://e-banking.hangseng.com/1/2/newuserregistration?regLanguage=zh","EBankTopFrame","width=1010,height=870,top=0,left=0,status=1,scrollbars=1,toolbar=0,location=0,menubar=0,resizable=1");
	}else if(type=="cn"){
		window.open("https://e-banking.hangseng.com/1/2/newuserregistration?regLanguage=zh_CN","EBankTopFrame","width=1010,height=870,top=0,left=0,status=1,scrollbars=1,toolbar=0,location=0,menubar=0,resizable=1");
	}else{
		window.open("https://e-banking.hangseng.com/1/2/newuserregistration?regLanguage=en","EBankTopFrame","width=1010,height=870,top=0,left=0,status=1,scrollbars=1,toolbar=0,location=0,menubar=0,resizable=1");
	}
}

function p2g_sectrad_intlogon(locale){
	var url = "/1/2/personal/interim-logon?targetPage=IVTDE001&WT.ac=HASE_P2G_PWS_HP_HKSTOCK_EN&";
	var msg = "Are you sure to close your existing e-banking browser and logon again?";
	if(locale=="zh"){
		msg = "\u95A3\u4E0B\u662F\u5426\u78BA\u5B9A\u95DC\u9589\u73FE\u6709\u7684e-banking\u8996\u7A97\u4EE5\u91CD\u65B0\u767B\u5165?";
		url = "/1/2/chi/personal/interim-logon?targetPage=IVTDE001&WT.ac=HASE_P2G_PWS_HP_HKSTOCK_EN&";
	} else if (locale=="cn") {
		msg = "\u9601\u4E0B\u662F\u5426\u786E\u5B9A\u5173\u95ED\u73B0\u6709\u7684e-banking\u89C6\u7A97\u4EE5\u91CD\u65B0\u767B\u5165?";
		url = "/1/2/schi/personal/interim-logon?targetPage=IVTDE001&WT.ac=HASE_P2G_PWS_HP_HKSTOCK_EN&";
	}
	if(!logonWin || logonWin.closed) {
	} else {
		if(confirm(msg)) {
			logonWin.close();
		} else {
			return;
		}
	}
	logonWin=window.open(url,"EBankTopFrame","width=1024,height=768,top=0,left=0,status=1,scrollbars=1,toolbar=0,location=0,menubar=0,resizable=1");
}
/* new for Public Website Revamp end */

function showMtgRemark() {// for Mortgage Calculator remark
	var result01 = document.querySelector(".rvp_mortgage .rvp_resultContainer");
	var result02 = document.querySelector(".rvp_mortgage_calculator .rvp_resultContainer");
	var remark = document.querySelectorAll(".rvp_mortgage .rvp_remarks");
	if(result01 || result02){
	 	for(var i = 0,len = remark.length; i < len; i++){
	 		remark[i].style.display = "block";
	 	}
	}else{
		for(var i = 0,len = remark.length; i < len; i++){
	 		remark[i].style.display = "none";
	 	}
	}
}