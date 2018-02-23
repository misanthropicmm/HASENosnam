<!--
function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

function wt_getSite(str)
{
	pos = str.indexOf(";")
	if (pos > -1)
		return str.substring(0, pos);
	else
		return str;
}

function wt_getIBType(str)
{
	pos = str.indexOf(";")
	if (pos > -1)
		return str.substring(pos+1, str.length);
	else
		return "";
}

function openContactUs(url, width, height) {
	if (url) {
		var pagewidth = width;		//popup page width 
		var pageheight = height;	//popup page height
		var pageleft = (screen.width - pagewidth) / 2;		//center of screen
		var pagetop = (screen.height - pageheight) / 2;		//center of screen
		var position = "width="+pagewidth+",height="+pageheight+",top="+pagetop+",left="+pageleft+",status=1,scrollbars=1,toolbar=0,location=0,menubar=0,resizable=1";
		window.open(url,"Insurance",position);
	}
}

//content - common -- start
function MM_reloadPage(init) {  //reloads the window if Nav4 resized
  if (init==true) with (navigator) {if ((appName=="Netscape")&&(parseInt(appVersion)==4)) {
    document.MM_pgW=innerWidth; document.MM_pgH=innerHeight; onresize=MM_reloadPage; }}
  else if (innerWidth!=document.MM_pgW || innerHeight!=document.MM_pgH) location.reload();
}

function PopUp(url,win,opts) {
	var aa=window.open(url,win,opts);
	aa.focus();
}

// modified on 20051208 -- start
function Get_Cookie(name) { 
   var start = document.cookie.indexOf(name+"="); 
   var len = start+name.length+1; 
   if ((!start) && (name != document.cookie.substring(0,name.length))) return null; 
   if (start == -1) return null; 
   var end = document.cookie.indexOf(";",len); 
   if (end == -1) end = document.cookie.length; 
   return unescape(document.cookie.substring(len,end)); 
} 

function Set_Cookie(name,value,expires,path,domain,secure) { 
    var cookieString = name + "=" +escape(value) + 
       ( (expires) ? ";expires=" + expires.toGMTString() : "") + 
       ( (path) ? ";path=" + path : "") + 
       ( (domain) ? ";domain=" + domain : "") + 
       ( (secure) ? ";secure" : ""); 
    document.cookie = cookieString; 
} 

function Delete_Cookie(name,path,domain) { 
   if (Get_Cookie(name)) document.cookie = name + "=" + 
      ( (path) ? ";path=" + path : "") + 
      ( (domain) ? ";domain=" + domain : "") + 
      ";expires=Thu, 01-Jan-70 00:00:01 GMT"; 
} 
// modified on 20051208 -- end
//content - common -- end

//content - personal_y07 -- start
function personalGotoURL(l) {
	var sect = peritem[l].sect;
	var to = peritem[l].to;
	clk(sect,to);
	
	var lnk=peritem[l].link;
	var tok=lnk.split('?');

	var url='';
	var prm='';
	if (tok.length >= 1) url=tok[0];
	if (tok.length >= 2) prm=tok[1];
	
	tok=prm.split('&');
	
	var x='';
	var p='';
	var s='';
	var n='';
	for (var i=0;i<tok.length;i++) {

		var id=tok[i].substr(0,2);
		if 			(id=='p=') p=tok[i].substr(2);
		else if (id=='s=') s=tok[i].substr(2);
		else if (id=='n=') n=tok[i].substr(2);
		else {
			if (x!='') x+='&';
			x+= tok[i];
		}
	}
	if (x!='') url+=('?'+x);
	
	if (url!='') {
		if (p=='') 					parent.location.href=url;
		else if (p=='self') self.location.href=url;
		else if (p=='top') 	parent.location.href=url;
		else if (p=='pop') 	window.open(url,n,s);
	}
	return false;
}

function personalGotoURL2(l) {
	var sect = peritem[l].sect;
	var to = peritem[l].to;
	clk(sect,to);
	x=peritem[l].link;
	y=x.indexOf("p=self");
	if (y>0)
	{
		x=x.substr(0,y-1)
		self.location.href=x;
	}
	else
	{
		y=x.indexOf("p=top");
		if (y>0)
		{
			x=x.substr(0,y-1)
			parent.location.href=x;
		}
		else
		{
			y=x.indexOf("p=pop");
			if (y>0)
			{
				i=x.indexOf("&s=");
				a=x.substr(i+3);
				d=a.indexOf("&");
				if (d >= 0)
					s=a.substr(0,d);
				else
					s='';
				j=a.indexOf("&n=");
				if (j >= 0)
					n=a.substr(j+3);
				else
					n='';
				x=x.substr(0,y-1);
				window.open(x,n,s);
			}
			else
			{
				if (x!='')
					parent.location.href=x;
			}
		}
	}
	return false;
}
//content - personal_y07 -- end

//content - business_y07 -- start
function businessGotoURL(l) {
	var sect = busitem[l].sect;
	var to = busitem[l].to;
	clk(sect,to);
	
	var lnk=busitem[l].link;
	var tok=lnk.split('?');

	var url='';
	var prm='';
	if (tok.length >= 1) url=tok[0];
	if (tok.length >= 2) prm=tok[1];
	
	tok=prm.split('&');
	
	var x='';
	var p='';
	var s='';
	var n='';
	for (var i=0;i<tok.length;i++) {

		var id=tok[i].substr(0,2);
		if 			(id=='p=') p=tok[i].substr(2);
		else if (id=='s=') s=tok[i].substr(2);
		else if (id=='n=') n=tok[i].substr(2);
		else {
			if (x!='') x+='&';
			x+= tok[i];
		}
	}
	if (x!='') url+=('?'+x);
	
	if (url!='') {
		if (p=='') 					parent.location.href=url;
		else if (p=='self') self.location.href=url;
		else if (p=='top') 	parent.location.href=url;
		else if (p=='pop') 	window.open(url,n,s);
	}
	return false;
}

function businessGotoURL2(l) {
	var sect = busitem[l].sect;
	var to = busitem[l].to;
	clk(sect,to);
	x=busitem[l].link;
	y=x.indexOf("p=self");
	if (y>0)
	{
		x=x.substr(0,y-1)
		self.location.href=x;
	}
	else
	{
		y=x.indexOf("p=top");
		if (y>0)
		{
			x=x.substr(0,y-1)
			parent.location.href=x;
		}
		else
		{
			y=x.indexOf("p=pop");
			if (y>0)
			{
				i=x.indexOf("&s=");
				a=x.substr(i+3);
				d=a.indexOf("&");
				if (d >= 0)
					s=a.substr(0,d);
				else
					s='';
				j=a.indexOf("&n=");
				if (j >= 0)
					n=a.substr(j+3);
				else
					n='';
				x=x.substr(0,y-1);
				window.open(x,n,s);
			}
			else
			{
				if (x!='')
					parent.location.href=x;
			}
		}
	}
	return false;
}
//content - business_y07 -- end

//content - qlbox_y07 -- start
function quickLinkGotoURL(l) {
	var sect = qlitem[l].sect;
	var to = qlitem[l].to;
	clk(sect,to);
	
	var lnk=qlitem[l].link;
	var tok=lnk.split('?');

	var url='';
	var prm='';
	if (tok.length >= 1) url=tok[0];
	if (tok.length >= 2) prm=tok[1];
	
	tok=prm.split('&');
	
	var x='';
	var p='';
	var s='';
	var n='';
	for (var i=0;i<tok.length;i++) {

		var id=tok[i].substr(0,2);
		if 			(id=='p=') p=tok[i].substr(2);
		else if (id=='s=') s=tok[i].substr(2);
		else if (id=='n=') n=tok[i].substr(2);
		else {
			if (x!='') x+='&';
			x+= tok[i];
		}
	}
	if (x!='') url+=('?'+x);
	
	if (url!='') {
		if (p=='') 					parent.location.href=url;
		else if (p=='self') self.location.href=url;
		else if (p=='top') 	parent.location.href=url;
		else if (p=='pop') 	window.open(url,n,s);
	}	
	return false;
}

function quickLinkGotoURL2(l) {
	var sect = qlitem[l].sect;
	var to = qlitem[l].to;
	clk(sect,to);
	x=qlitem[l].link;
	alert(x);
	y=x.indexOf("p=self");
	if (y>0)
	{
		x=x.substr(0,y-1)
		self.location.href=x;
	}
	else
	{
		y=x.indexOf("p=top");
		if (y>0)
		{
			x=x.substr(0,y-1)
			parent.location.href=x;
		}
		else
		{
			y=x.indexOf("p=pop");
			if (y>0)
			{
				i=x.indexOf("&s=");
				a=x.substr(i+3);
				d=a.indexOf("&");
				if (d >= 0) 
					s=a.substr(0,d);
				else
					s='';
				j=a.indexOf("&n=");
				if (j >= 0)
					n=a.substr(j+3);
				else
					n='';
				x=x.substr(0,y-1);
				window.open(x,n,s);
			}
			else
			{
				if (x!='')
					parent.location.href=x;
			}
		}
	}
	return false;
}
//content - qlbox_y07 -- end

//content - ratebox_y07 -- start
function rateGotoURL(l) {
	var sect = rateitem[l].sect;
	var to = rateitem[l].to;
	clk(sect,to);
	
	var lnk=rateitem[l].link;
	var tok=lnk.split('?');

	var url='';
	var prm='';
	if (tok.length >= 1) url=tok[0];
	if (tok.length >= 2) prm=tok[1];
	
	tok=prm.split('&');
	
	var x='';
	var p='';
	var s='';
	var n='';
	for (var i=0;i<tok.length;i++) {

		var id=tok[i].substr(0,2);
		if 			(id=='p=') p=tok[i].substr(2);
		else if (id=='s=') s=tok[i].substr(2);
		else if (id=='n=') n=tok[i].substr(2);
		else {
			if (x!='') x+='&';
			x+= tok[i];
		}
	}
	if (x!='') url+=('?'+x);
	
	if (url!='') {
		if (p=='') 					parent.location.href=url;
		else if (p=='self') self.location.href=url;
		else if (p=='top') 	parent.location.href=url;
		else if (p=='pop') 	window.open(url,n,s);
	}
	return false;
}

function rateGotoURL2(l) {
	var sect = rateitem[l].sect;
	var to = rateitem[l].to;
	clk(sect,to);
	x=rateitem[l].link;
	y=x.indexOf("p=self");
	if (y>0)
	{
		x=x.substr(0,y-1)
		self.location.href=x;
	}
	else
	{
		y=x.indexOf("p=top");
		if (y>0)
		{
			x=x.substr(0,y-1)
			parent.location.href=x;
		}
		else
		{
			y=x.indexOf("p=pop");
			if (y>0)
			{
				i=x.indexOf("&s=");
				a=x.substr(i+3);
				d=a.indexOf("&");
				if (d >= 0)
					s=a.substr(0,d);
				else
					s='';
				j=a.indexOf("&n=");
				if (j >= 0)
					n=a.substr(j+3);
				else
					n='';
				x=x.substr(0,y-1);
				window.open(x,n,s);
			}
			else
			{
				if (x!='')
					parent.location.href=x;
			}
		}
	}
	return false;
}
//content - ratebox_y07 -- end

function fQuickLinkGo(form) {
		 quickLinkGotoURL(form.qlselect.options[form.qlselect.selectedIndex].value);
}

function fRateGo(form) {
		 rateGotoURL(form.rateselect.options[form.rateselect.selectedIndex].value);
}

function demo_popup(theURL) {
  window.open(theURL,'','width=660,height=500,top=5,left=5,toolbar=0,menubar=0,location=0,scrollbars=1,status=0,resizable=1');
}

function cms_link(file){
	var sUrl = location.href;
	var dUrl = "";

	if (file.indexOf('http') > -1) {
		dUrl=file;
	} else {
		if (sUrl.indexOf('https') > -1){
			dUrl = "https://www.hangseng.com/cms"+file;
		}else{
			dUrl = "http://www.hangseng.com/cms"+file;
		}
	}
	window.open(dUrl,"cms","scrollbars,menubar,toolbar,resizable,status=1");
}
//-->