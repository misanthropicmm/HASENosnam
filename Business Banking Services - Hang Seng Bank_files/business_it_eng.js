function bib_logonreg(type,lang){
	if (type=="bib_logon"){
		window.open('https://ebusiness.hangseng.com/1/2/?idv_cmd=idv.Authentication&nextPage=b2g.hase.launching&__targetLocale=en','haseb2gmain','top=5,left=5,width=800,height=600,scrollbars=1,status=1,resizable=1');
	}else if (type == "bib_register" ){
		window.open('https://ebusiness.hangseng.com/1/2/?idv_cmd=idv.Authentication&nextPage=B2G_CAM40_BIB_PREREGISTRATION&start=start&action=registration&__locale=en','haseb2gmain','top=5,left=5,width=800,height=600,scrollbars=1,status=1,resizable=yes');
	}
}

function getpage(p_code, p_src) {
	if (p_code == "hsn001") {
		return "https://www.login.hsbc.com/code/public/en_US/login/cam2password.jhtml";
	}
	else if (p_code == "hsn012") {
		return "https://www.secure.hsbcnet.com/uims/portal/UserRegistration?partnerid=HKHASE";
	}
} 

function bizlogon(){
	var form = document.logonbox;
	if (form.idType[0].checked) {
		bib_logonreg("bib_logon","eng");
	} else {
		if (form.idType[1].checked) {
			window.open('http://www.hangseng.com/cms/sidnet/files/hsbcnet/eng/hkform.html','','top=5,left=5,width=1024,height=768,scrollbars=1,status=1');
		} 
	}	
}

function bizRegister(){
 
			window.open(getpage('hsn012','http://www.hangseng.com/hsb/eng/home/hse.html'),'','top=5,left=5,width=800,height=600,scrollbars=1,status=1');
 
}

function bizKnowmore(){
	var form = document.logonbox;
	if (form.idType[0].checked) {
		var p="/1/2/e-services/business-ebanking/hk-business-ebanking";
		top.location.href=p; 
	} else {
		if (form.idType[1].checked) {
			var p="/1/2/e-services/hsbcnet/hkhsbcnet";
			top.location.href=p; 
		} 
	}	
}
