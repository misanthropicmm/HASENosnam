//tealium universal tag - utag.2 ut4.0.201709271648, Copyright 2017 Tealium.com Inc. All Rights Reserved.
function WebTrends(){var that=this;this.dcsid="dcsijcs2r000000s9yunw0krk_5d8t";this.dcsid=(function(){var domlist='';var doms=that.dcsSplit(domlist);var dlen=doms.length;var host=window.location.hostname.toLowerCase();for(var i=0;i<dlen;i++){if(host==doms[i]){return('');}}
return('dcsijcs2r000000s9yunw0krk_5d8t');})();this.domain="www1.member-hsbc-group.com";this.timezone=0;this.fpcdom=utag.cfg.domain;this.onsitedoms=utag.cfg.domain;this.downloadtypes="xls,doc,pdf,txt,csv,zip,docx,xlsx,rar,gzip";this.navigationtag="div,table";this.trackevents=true;this.trimoffsiteparams=true;this.enabled=true;this.i18n=true;this.fpc='WT_FPC';this.paidsearchparams='gclid';this.splitvalue='';this.preserve=true;this.DCS={};this.WT={};this.DCSext={};this.images=[];this.index=0;this.qp=[];this.exre=(function(){return(window.RegExp?new RegExp("dcs(uri)|(ref)|(aut)|(met)|(sta)|(sip)|(pro)|(byt)|(dat)|(p3p)|(cfg)|(redirect)|(cip)","i"):"");})();this.re=(function(){return(window.RegExp?(that.i18n?{"%25":/\%/g}:{"%09":/\t/g,"%20":/ /g,"%23":/\#/g,"%26":/\&/g,"%2B":/\+/g,"%3F":/\?/g,"%5C":/\\/g,"%22":/\"/g,"%7F":/\x7F/g,"%A0":/\xA0/g}):"");})();}
WebTrends.prototype.dcsGetId=function(){}
WebTrends.prototype.dcsGetCookie=function(name){var cookies=document.cookie.split("; ");var cmatch=[];var idx=0;var i=0;var namelen=name.length;var clen=cookies.length;for(i=0;i<clen;i++){var c=cookies[i];if((c.substring(0,namelen+1))==(name+"=")){cmatch[idx++]=c;}}
var cmatchCount=cmatch.length;if(cmatchCount>0){idx=0;if((cmatchCount>1)&&(name==this.fpc)){var dLatest=new Date(0);for(i=0;i<cmatchCount;i++){var lv=parseInt(this.dcsGetCrumb(cmatch[i],"lv"));var dLst=new Date(lv);if(dLst>dLatest){dLatest.setTime(dLst.getTime());idx=i;}}}
return unescape(cmatch[idx].substring(namelen+1));}
else{return null;}}
WebTrends.prototype.dcsGetCrumb=function(cval,crumb,sep){var aCookie=cval.split(sep||":");for(var i=0;i<aCookie.length;i++){var aCrumb=aCookie[i].split("=");if(crumb==aCrumb[0]){return aCrumb[1];}}
return null;}
WebTrends.prototype.dcsGetIdCrumb=function(cval,crumb){var id=cval.substring(0,cval.indexOf(":lv="));var aCrumb=id.split("=");for(var i=0;i<aCrumb.length;i++){if(crumb==aCrumb[0]){return aCrumb[1];}}
return null;}
WebTrends.prototype.dcsIsFpcSet=function(name,id,lv,ss){var c=this.dcsGetCookie(name);if(c){return((id==this.dcsGetIdCrumb(c,"id"))&&(lv==this.dcsGetCrumb(c,"lv"))&&(ss==this.dcsGetCrumb(c,"ss")))?0:3;}
return 2;}
WebTrends.prototype.dcsFPC=function(){if(document.cookie.indexOf("WTLOPTOUT=")!=-1){return;}
var WT=this.WT;var name=this.fpc;var dCur=new Date();var adj=(dCur.getTimezoneOffset()*60000)+(this.timezone*3600000);dCur.setTime(dCur.getTime()+adj);var dExp=new Date(dCur.getTime()+315360000000);var dSes=new Date(dCur.getTime());WT.co_f=WT.vtid=WT.vtvs=WT.vt_f=WT.vt_f_a=WT.vt_f_s=WT.vt_f_d=WT.vt_f_tlh=WT.vt_f_tlv="";if(document.cookie.indexOf(name+"=")==-1){if((typeof(gWtId)!="undefined")&&(gWtId!="")){WT.co_f=gWtId;}
else if((typeof(gTempWtId)!="undefined")&&(gTempWtId!="")){WT.co_f=gTempWtId;WT.vt_f="1";}
else{WT.co_f="2";var curt=dCur.getTime().toString();for(var i=2;i<=(32-curt.length);i++){WT.co_f+=Math.floor(Math.random()*16.0).toString(16);}
WT.co_f+=curt;WT.vt_f="1";}
if(typeof(gWtAccountRollup)=="undefined"){WT.vt_f_a="1";}
WT.vt_f_s=WT.vt_f_d="1";WT.vt_f_tlh=WT.vt_f_tlv="0";}
else{var c=this.dcsGetCookie(name);var id=this.dcsGetIdCrumb(c,"id");var lv=parseInt(this.dcsGetCrumb(c,"lv"));var ss=parseInt(this.dcsGetCrumb(c,"ss"));if((id==null)||(id=="null")||isNaN(lv)||isNaN(ss)){return;}
WT.co_f=id;var dLst=new Date(lv);WT.vt_f_tlh=Math.floor((dLst.getTime()-adj)/1000);dSes.setTime(ss);if((dCur.getTime()>(dLst.getTime()+1800000))||(dCur.getTime()>(dSes.getTime()+28800000))){WT.vt_f_tlv=Math.floor((dSes.getTime()-adj)/1000);dSes.setTime(dCur.getTime());WT.vt_f_s="1";}
if((dCur.getDay()!=dLst.getDay())||(dCur.getMonth()!=dLst.getMonth())||(dCur.getYear()!=dLst.getYear())){WT.vt_f_d="1";}}
WT.co_f=escape(WT.co_f);WT.vtid=(typeof(this.vtid)=="undefined")?WT.co_f:(this.vtid||"");WT.vtvs=(dSes.getTime()-adj).toString();var expiry="; expires="+dExp.toGMTString();var cur=dCur.getTime().toString();var ses=dSes.getTime().toString();document.cookie=name+"="+"id="+WT.co_f+":lv="+cur+":ss="+ses+expiry+"; path=/"+(((this.fpcdom!=""))?("; domain="+this.fpcdom):(""));var rc=this.dcsIsFpcSet(name,WT.co_f,cur,ses);if(rc!=0){WT.co_f=WT.vtvs=WT.vt_f_s=WT.vt_f_d=WT.vt_f_tlh=WT.vt_f_tlv="";if(typeof(this.vtid)=="undefined"){WT.vtid="";}
WT.vt_f=WT.vt_f_a=rc;}}
WebTrends.prototype.dcsQP=function(N){if(typeof(N)=="undefined"){return"";}
var qry=location.search.substring(1);if(qry!=""){var pairs=qry.split("&");for(var i=0;i<pairs.length;i++){var pos=pairs[i].indexOf("=");if(pos!=-1){if(pairs[i].substring(0,pos)==N){this.qp[this.qp.length]=(i==0?"":"&")+pairs[i];return pairs[i].substring(pos+1);}}}}
return"";}
WebTrends.prototype.dcsIsOnsite=function(host){if(host.length>0){host=host.toLowerCase();if(host==window.location.hostname.toLowerCase()){return true;}
if(typeof(this.onsitedoms.test)=="function"){return this.onsitedoms.test(host);}
else if(this.onsitedoms.length>0){var doms=this.dcsSplit(this.onsitedoms);var len=doms.length;for(var i=0;i<len;i++){if(host==doms[i]){return true;}}}}
return false;}
WebTrends.prototype.dcsTypeMatch=function(pth,typelist){var type=pth.toLowerCase().substring(pth.lastIndexOf(".")+1,pth.length);var types=this.dcsSplit(typelist);var tlen=types.length;for(var i=0;i<tlen;i++){if(type==types[i]){return true;}}
return false;}
WebTrends.prototype.dcsEvt=function(evt,tag){var e=evt.target||evt.srcElement;while(e.tagName&&(e.tagName.toLowerCase()!=tag.toLowerCase())){e=e.parentElement||e.parentNode;}
return e;}
WebTrends.prototype.dcsNavigation=function(evt){var id="";var cname="";var elems=this.dcsSplit(this.navigationtag);var elen=elems.length;var i,e,elem;for(i=0;i<elen;i++){elem=elems[i];if(elem.length){e=this.dcsEvt(evt,elem);id=(e.getAttribute&&e.getAttribute("id"))?e.getAttribute("id"):"";cname=e.className||"";if(id.length||cname.length){break;}}}
return id.length?id:cname;}
WebTrends.prototype.dcsBind=function(event,func){if((typeof(func)=="function")&&document.body){if(document.body.addEventListener){document.body.addEventListener(event,func.wtbind(this),true);}
else if(document.body.attachEvent){document.body.attachEvent("on"+event,func.wtbind(this));}}}
WebTrends.prototype.dcsET=function(){var e=(navigator.appVersion.indexOf("MSIE")!=-1)?"click":"mousedown";this.dcsBind(e,this.dcsDownload);this.dcsBind(e,this.dcsOffsite);}
WebTrends.prototype.dcsMultiTrack=function(){var args=arguments;if(args.length%2==0){this.dcsSetProps(args);this.dcsFPC();this.dcsTag();}}
WebTrends.prototype.dcsCleanUp=function(){this.DCS={};this.WT={};this.DCSext={};if(arguments.length%2==0){this.dcsSetProps(arguments);}}
WebTrends.prototype.dcsSetProps=function(args){for(var i=0;i<args.length;i+=2){if(args[i].indexOf('WT.')==0){this.WT[args[i].substring(3)]=args[i+1];}
else if(args[i].indexOf('DCS.')==0){this.DCS[args[i].substring(4)]=args[i+1];}
else if(args[i].indexOf('DCSext.')==0){this.DCSext[args[i].substring(7)]=args[i+1];}}}
WebTrends.prototype.dcsSplit=function(list){var items=list.toLowerCase().split(",");var len=items.length;for(var i=0;i<len;i++){items[i]=items[i].replace(/^\s*/,"").replace(/\s*$/,"");}
return items;}
WebTrends.prototype.dcsDownload=function(evt){evt=evt||(window.event||"");if(evt&&((typeof(evt.which)!="number")||(evt.which==1))){var e=this.dcsEvt(evt,"A");if(e.href){var hn=e.hostname?(e.hostname.split(":")[0]):"";if(this.dcsIsOnsite(hn)&&this.dcsTypeMatch(e.pathname,this.downloadtypes)){var qry=e.search?e.search.substring(e.search.indexOf("?")+1,e.search.length):"";var pth=e.pathname?((e.pathname.indexOf("/")!=0)?"/"+e.pathname:e.pathname):"/";var ttl="";var text=document.all?e.innerText:e.text;var img=this.dcsEvt(evt,"IMG");if(img.alt){ttl=img.alt;}
else if(text){ttl=text;}
else if(e.innerHTML){ttl=e.innerHTML;}
dcsMultiTrack("DCS.dcssip",hn,"DCS.dcsuri",pth,"DCS.dcsqry",e.search||"","WT.ti","Download:"+ttl,"WT.dl","20","WT.nv",this.dcsNavigation(evt));this.DCS.dcssip=this.DCS.dcsuri=this.DCS.dcsqry=this.WT.ti=this.WT.dl=this.WT.nv="";}}}}
WebTrends.prototype.dcsOffsite=function(evt){evt=evt||(window.event||"");if(evt&&((typeof(evt.which)!="number")||(evt.which==1))){var e=this.dcsEvt(evt,"A");if(e.href){var hn=e.hostname?(e.hostname.split(":")[0]):"";var pr=e.protocol||"";if((hn.length>0)&&(pr.indexOf("http")==0)&&!this.dcsIsOnsite(hn)){var qry=e.search?e.search.substring(e.search.indexOf("?")+1,e.search.length):"";var pth=e.pathname?((e.pathname.indexOf("/")!=0)?"/"+e.pathname:e.pathname):"/";dcsMultiTrack("DCS.dcssip",hn,"DCS.dcsuri",pth,"DCS.dcsqry",this.trimoffsiteparams?"":qry,"DCS.dcsref",window.location,"WT.ti","Offsite:"+hn+pth+"?"+qry,"WT.dl","24","WT.nv",this.dcsNavigation(evt));this.DCS.dcssip=this.DCS.dcsuri=this.DCS.dcsqry=this.DCS.dcsref=this.WT.ti=this.WT.dl=this.WT.nv="";}}}}
WebTrends.prototype.dcsAdv=function(){if(this.trackevents&&(typeof(this.dcsET)=="function")){if(window.addEventListener){window.addEventListener("load",this.dcsET.wtbind(this),false);}
else if(window.attachEvent){window.attachEvent("onload",this.dcsET.wtbind(this));}}
this.dcsFPC();}
WebTrends.prototype.dcsVar=function(){var dCurrent=new Date();var WT=this.WT;var DCS=this.DCS;WT.tz=parseInt(dCurrent.getTimezoneOffset()/60*-1)||"0";WT.bh=dCurrent.getHours()||"0";WT.ul=navigator.appName=="Netscape"?navigator.language:navigator.userLanguage;if(typeof(screen)=="object"){WT.cd=navigator.appName=="Netscape"?screen.pixelDepth:screen.colorDepth;WT.sr=screen.width+"x"+screen.height;}
if(typeof(navigator.javaEnabled())=="boolean"){WT.jo=navigator.javaEnabled()?"Yes":"No";}
if(document.title){if(window.RegExp){var tire=new RegExp("^"+window.location.protocol+"//"+window.location.hostname+"\\s-\\s");WT.ti=document.title.replace(tire,"");}
else{WT.ti=document.title;}}
WT.js="Yes";WT.jv=(function(){var agt=navigator.userAgent.toLowerCase();var major=parseInt(navigator.appVersion);var mac=(agt.indexOf("mac")!=-1);var ff=(agt.indexOf("firefox")!=-1);var ff0=(agt.indexOf("firefox/0.")!=-1);var ff10=(agt.indexOf("firefox/1.0")!=-1);var ff15=(agt.indexOf("firefox/1.5")!=-1);var ff20=(agt.indexOf("firefox/2.0")!=-1);var ff3up=(ff&&!ff0&&!ff10&!ff15&!ff20);var nn=(!ff&&(agt.indexOf("mozilla")!=-1)&&(agt.indexOf("compatible")==-1));var nn4=(nn&&(major==4));var nn6up=(nn&&(major>=5));var ie=((agt.indexOf("msie")!=-1)&&(agt.indexOf("opera")==-1));var ie4=(ie&&(major==4)&&(agt.indexOf("msie 4")!=-1));var ie5up=(ie&&!ie4);var op=(agt.indexOf("opera")!=-1);var op5=(agt.indexOf("opera 5")!=-1||agt.indexOf("opera/5")!=-1);var op6=(agt.indexOf("opera 6")!=-1||agt.indexOf("opera/6")!=-1);var op7up=(op&&!op5&&!op6);var jv="1.1";if(ff3up){jv="1.8";}
else if(ff20){jv="1.7";}
else if(ff15){jv="1.6";}
else if(ff0||ff10||nn6up||op7up){jv="1.5";}
else if((mac&&ie5up)||op6){jv="1.4";}
else if(ie5up||nn4||op5){jv="1.3";}
else if(ie4){jv="1.2";}
return jv;})();WT.ct="unknown";if(document.body&&document.body.addBehavior){try{document.body.addBehavior("#default#clientCaps");WT.ct=document.body.connectionType||"unknown";document.body.addBehavior("#default#homePage");WT.hp=document.body.isHomePage(location.href)?"1":"0";}
catch(e){}}
if(document.all){WT.bs=document.body?document.body.offsetWidth+"x"+document.body.offsetHeight:"unknown";}
else{WT.bs=window.innerWidth+"x"+window.innerHeight;}
WT.fv=(function(){var i,flash;if(window.ActiveXObject){for(i=10;i>0;i--){try{flash=new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+i);return i+".0";}
catch(e){}}}
else if(navigator.plugins&&navigator.plugins.length){for(i=0;i<navigator.plugins.length;i++){if(navigator.plugins[i].name.indexOf('Shockwave Flash')!=-1){return navigator.plugins[i].description.split(" ")[2];}}}
return"Not enabled";})();WT.slv=(function(){var slv="Not enabled";try{if(navigator.userAgent.indexOf('MSIE')!=-1){var sli=new ActiveXObject('AgControl.AgControl');if(sli){slv="Unknown";}}
else if(navigator.plugins["Silverlight Plug-In"]){slv="Unknown";}}
catch(e){}
if(slv!="Not enabled"){var i,j,v;if((typeof(Silverlight)=="object")&&(typeof(Silverlight.isInstalled)=="function")){for(i=3;i>0;i--){for(j=9;j>=0;j--){v=i+"."+j;if(Silverlight.isInstalled(v)){slv=v;break;}}
if(slv==v){break;}}}}
return slv;})();if(this.i18n){if(typeof(document.defaultCharset)=="string"){WT.le=document.defaultCharset;}
else if(typeof(document.characterSet)=="string"){WT.le=document.characterSet;}
else{WT.le="unknown";}}
WT.tv="8.6.2";WT.dl="0";WT.ssl=(window.location.protocol.indexOf('https:')==0)?"1":"0";DCS.dcsdat=dCurrent.getTime();DCS.dcssip=window.location.hostname;DCS.dcsuri=window.location.pathname;WT.es=DCS.dcssip+DCS.dcsuri;if(window.location.search){DCS.dcsqry=window.location.search;if(this.qp.length>0){for(var i=0;i<this.qp.length;i++){var pos=DCS.dcsqry.indexOf(this.qp[i]);if(pos!=-1){var front=DCS.dcsqry.substring(0,pos);var end=DCS.dcsqry.substring(pos+this.qp[i].length,DCS.dcsqry.length);DCS.dcsqry=front+end;}}}}
if(DCS.dcsqry){var dcsqry=DCS.dcsqry.toLowerCase();var params=this.paidsearchparams.length?this.paidsearchparams.toLowerCase().split(","):[];for(var i=0;i<params.length;i++){if(dcsqry.indexOf(params[i]+"=")!=-1){WT.srch="1";break;}}}
if((window.document.referrer!="")&&(window.document.referrer!="-")){if(!(navigator.appName=="Microsoft Internet Explorer"&&parseInt(navigator.appVersion)<4)){DCS.dcsref=window.document.referrer;}}}
WebTrends.prototype.dcsEscape=function(S,REL){if(REL!=""){S=S.toString();for(var R in REL){if(REL[R]instanceof RegExp){S=S.replace(REL[R],R);}}
return S;}
else{return escape(S);}}
WebTrends.prototype.dcsA=function(N,V){if(this.i18n&&(this.exre!="")&&!this.exre.test(N)){if(N=="dcsqry"){var newV="";var params=V.substring(1).split("&");for(var i=0;i<params.length;i++){var pair=params[i];var pos=pair.indexOf("=");if(pos!=-1){var key=pair.substring(0,pos);var val=pair.substring(pos+1);if(i!=0){newV+="&";}
newV+=key+"="+this.dcsEncode(val);}}
V=V.substring(0,1)+newV;}
else{V=this.dcsEncode(V);}}
return"&"+N+"="+this.dcsEscape(V,this.re);}
WebTrends.prototype.dcsEncode=function(S){return(typeof(encodeURIComponent)=="function")?encodeURIComponent(S):escape(S);}
WebTrends.prototype.dcsCreateImage=function(dcsSrc){if(document.images){this.images[this.index]=new Image();this.images[this.index].src=dcsSrc;this.index++;}
else{document.write('<IMG ALT="" BORDER="0" NAME="DCSIMG" WIDTH="1" HEIGHT="1" SRC="'+dcsSrc+'">');}}
WebTrends.prototype.dcsMeta=function(){var elems;if(document.all){elems=document.all.tags("meta");}
else if(document.documentElement){elems=document.getElementsByTagName("meta");}
if(typeof(elems)!="undefined"){var length=elems.length;for(var i=0;i<length;i++){var name=elems.item(i).name;var content=elems.item(i).content;var equiv=elems.item(i).httpEquiv;if(name.length>0){if(name.toUpperCase().indexOf("WT.")==0){this.WT[name.substring(3)]=content;}
else if(name.toUpperCase().indexOf("DCSEXT.")==0){this.DCSext[name.substring(7)]=content;}
else if(name.toUpperCase().indexOf("DCS.")==0){this.DCS[name.substring(4)]=content;}}}}}
WebTrends.prototype.dcsTag=function(){if(document.cookie.indexOf("WTLOPTOUT=")!=-1){return true;}
var WT=this.WT;var DCS=this.DCS;var DCSext=this.DCSext;var i18n=this.i18n;var P="//"+this.domain+(this.dcsid==""?'':'/'+this.dcsid)+"/dcs.gif?";if(i18n){WT.dep="";}
for(var N in DCS){if(DCS[N]&&(typeof DCS[N]!="function")){P+=this.dcsA(N,DCS[N]);}}
var keys=["co_f","vtid","vtvs","vt_f_tlv"];for(var i=0;i<keys.length;i++){var key=keys[i];if(WT[key]){P+=this.dcsA("WT."+key,WT[key]);delete WT[key];}}
for(N in WT){if(WT[N]&&(typeof WT[N]!="function")){P+=this.dcsA("WT."+N,WT[N]);}}
for(N in DCSext){if(DCSext[N]&&(typeof DCSext[N]!="function")){if(i18n){WT.dep=(WT.dep.length==0)?N:(WT.dep+";"+N);}
P+=this.dcsA(N,DCSext[N]);}}
if(i18n&&(WT.dep.length>0)){P+=this.dcsA("WT.dep",WT.dep);}
if(P.length>2048&&navigator.userAgent.indexOf('MSIE')>=0){return false;}
if(P.indexOf("?&")>0)P=(P.split("?&")).join("?");this.dcsCreateImage(P);this.WT.ad="";return true;}
WebTrends.prototype.dcsDebug=function(){var t=this;var i=t.images[0].src;var q=i.indexOf("?");var r=i.substring(0,q).split("/");var m="<b>Protocol</b><br><code>"+r[0]+"<br></code>";m+="<b>Domain</b><br><code>"+r[2]+"<br></code>";m+="<b>Path</b><br><code>/"+r[3]+"/"+r[4]+"<br></code>";m+="<b>Query Params</b><code>"+i.substring(q+1).replace(/\&/g,"<br>")+"</code>";m+="<br><b>Cookies</b><br><code>"+document.cookie.replace(/\;/g,"<br>")+"</code>";if(t.w&&!t.w.closed){t.w.close();}
t.w=window.open("","dcsDebug","width=500,height=650,scrollbars=yes,resizable=yes");t.w.document.write(m);t.w.focus();}
WebTrends.prototype.dcsCollect=function(){if(this.enabled){return this.dcsTag();}}
function dcsMultiTrack(){if(typeof(_tag)!="undefined"){return(_tag.dcsMultiTrack());}}
function dcsDebug(){if(typeof(_tag)!="undefined"){return(_tag.dcsDebug());}}
Function.prototype.wtbind=function(obj){var method=this;var temp=function(){return method.apply(obj,arguments);};return temp;}
try{(function(id,loader,u){try{u=utag.o[loader].sender[id]={}}catch(e){u=utag.sender[id]};u.ev={'view':1,'link':1};u.o=new WebTrends();u.map={"page_title":"WT.ti","page_url":"DCS.dcsuri","wt_onsitedoms":"onsitedoms","webtrends_dcsid":"dcsid","webtrends_dcsqry":"DCS.dcsqry","site_region":"DCSext.rgn","site_subregion":"DCSext.subrgn","site_country":"DCSext.cnty","site_entity":"DCSext.ent","site_brand":"DCSext.brand","page_language":"DCSext.language","page_security_level":"DCSext.cam","page_category":"WT.cg_n","page_ib_type":"DCSext.ibtype","site_section":"DCSext.site","page_customer_group":"DCSext.busline","page_business_line":"DCSext.custgrp","page_referrer":"DCS.dcsref","page_screenlayout":"WT.screenlayout","customer_id":"WT.dcsvid","product_quantity":"WT.tx_u,DCSext.HSBC_u","product_event":"WT.tx_e,DCSext.HSBC_e","page_ad_display":"WT.ad","page_ad_click":"WT.ac","event_type":"WT.dl","page_layout":"WT.scrn","search_term":"WT.oss","search_results":"WT.oss_r","search_scope":"WT.oss_scope","event_category":"WT.ria_a","event_subcategory":"WT.ria_f","event_action":"WT.ria_ev,WT.cta","event_content":"WT.ria_c","account_type":"WT.z_accTyp","currency_amount":"WT.z_inCur","country_code":"WT.z_inCnty","tool_name":"WT.tool_name","customer_group":"WT.seg_2","product_id":"WT.pn_sku","funnel_name":"WT.si_n","funnel_step":"WT.si_x","funnel_step_name":"WT.si_p","funnel_complete_flag":"WT.si_cs","transaction_currency_pair":"DCSext.currencyPair","customer_type":"WT.seg_1","error_code":"WT.er","page_product_type":"DCSext.prodline","page_channel":"DCSext.channel","page_subcategory":"WT.cg_s","transaction_charge_type":"WT.z_tranChar","transaction_date":"WT.tx_id","transaction_id":"WT.tx_i","transaction_time":"WT.tx_it","transaction_purpose":"WT.z_tranPur","transaction_execution_type":"WT.z_tranVdt","application_id":"WT.tx_i","application_date":"WT.tx_id","application_time":"WT.tx_it","campaign_id":"WT.mc_id","campaign_event":"WT.mc_ev","campaign_search_flag":"WT.srch","vam_action":"DCSext.vam_action","vam_id":"DCSext.vam_id","video_id":"WT.clip_id","video_name":"WT.clip_n","transaction_total":"WT.z_outVal","branch_selected":"WT.bls_l","business_industry":"DCSext.industry","business_inquiry":"DCSext.topic","business_location":"DCSext.location","business_name":"DCSext.c_name","business_market_interest":"DCSext.interest","business_revenue_range":"DCSext.rev_range","ut.profile":"DCSext.tms_id","test_id":"WT.experiment","order_currency":"WT.z_transCur","order_total":"WT.z_transVal","obfuscate_ip":"DCS.dcsipa"};u.extend=[function(a,b){try{if(1){b['webtrends_test_dcsid']='dcs2228w32975vu0l29draty1_7x7z'}}catch(e){utag.DB(e)}},function(a,b){try{if(1){b['webtrends_test_dcsid']='dcs222kllyfg6fxfo86yggags_8k4v'}}catch(e){utag.DB(e)}},function(a,b){"use strict";if(b.site_domain_type!=="prod"||b["ut.env"]!=="prod"){b.webtrends_dcsid=b.webtrends_test_dcsid;}
if(b.webtrends_dcsid){u.o.dcsid=b.webtrends_dcsid;}},function(a,b){(function(){"use strict";var adclickparam="WT.ac";var utag_data=b;if(document.links){var param=adclickparam+"=";var paramlen=param.length;var paramre=new RegExp(param,"i");var len=document.links.length;var pos=-1,end=-1;var anch="",urlp="",value="";var urlpre;var url=document.URL+"";var start=url.search(paramre);if(start!=-1){end=url.indexOf("&",start);urlp=url.substring(start,(end!=-1)?end:url.length);urlpre=new RegExp(urlp+"(&|#)","i");}
for(var i=0;i<len;i++){if(document.links[i].href){anch=document.links[i].href+"";if(urlp.length>0){anch=anch.replace(urlpre,"$1");}
pos=anch.search(paramre);if(pos!=-1){start=pos+paramlen;end=anch.indexOf("&",start);value=anch.substring(start,(end!=-1)?end:anch.length);utag_data.page_ad_display=utag_data.page_ad_display?(utag_data.page_ad_display+";"+value):value;}}}}})();},function(a,b){"use strict";if(u&&typeof u.o==="object"){u.o.DCS.dcsqry="";b.webtrends_dcsqry="?";u.o.WT.ac=utag_data["qp.WT.ac"];u.o.WT.mc_id=utag_data["qp.WT.mc_id"];u.o.WT.srch=utag_data["qp.WT.srch"];u.o.DCSext.link=utag_data["qp.link"];}},function(a,b){utag.data.wt_dl_mappings={"0":"view","99":"click","20":"download","21":"anchor","22":"js","23":"mailto","24":"exit_link","25":"download","26":"form_submit","27":"form_submit","28":"form_input","29":"form_button","30":"image_map","40":"video_impression","41":"video_event","50":"ad_impression","60":"mobile_interaction","61":"mobile_app_state","101":"vam_interaction","111":"share_facebook","125":"heatmap"};if(typeof b.event_type!=="undefined"){for(varName in utag.data.wt_dl_mappings){if(b.event_type===utag.data.wt_dl_mappings[varName]){b.event_type=varName;}}}else if(a==="link"){b.event_type="99";}
(function(window){"use strict";var event_data_config={"page_url":["DCS.dcsuri"],"page_title":["WT.ti"],"event_type":["WT.dl"],"tool_name":["WT.tool_name"],"customer_id":["WT.dcsvid"],"customer_group":["WT.seg_2","utag.data.customer_seg_2"],"customer_type":["WT.seg_1","utag.data.customer_seg_1"],"event_action":["DCSext.logon","DCSext.registration","WT.ria_ev","WT.cta","utag.data.event_name","utag.data.customer_logon"],"event_category":["WT.ria_a","utag.data.event_app"],"event_subcategory":["WT.ria_f","utag.data.event_feature"],"event_content":["WT.ria_c"],"funnel_name":["WT.si_n","utag.data.page_scenario_name"],"funnel_step":["WT.si_x","utag.data.page_scenario_step"],"page_language":["DCSext.language","utag.data.page_language_default"],"page_business_line":["DCSext.custgrp"],"page_category":["WT.cg_n"],"page_customer_group":["DCSext.busline"],"page_ib_type":["DSext.ibtype"],"page_layout":["WT.screenlayout","WT.scrn"],"page_product_type":["DCSext.prodline","utag.data.page_product_line"],"page_section":["DCSext.site"],"page_security_level":["DCSext.cam"],"product_event":["DCSext.HSBC_e","WT.tx_e","utag.data.product_custom_event"],"product_quantity":["WT.tx_u","DCSext.HSBC_u","utag.data.product_custom_event_quantity"],"product_id":["WT.pn_sku","utag.data.product_sku"],"search_results":["WT.oss_r"],"search_term":["WT.oss"],"site_brand":["DCSext.brand","utag.data.site_brand_default"],"site_country":["DCSext.cnty","utag.data.site_country_default"],"site_entity":["DCSext.ent","utag.data.site_entity_default"],"site_region":["DCSext.rgn","utag.data.site_region_default"],"site_subregion":["DCSext.subrgn","utag.data.site_subregion_default"],"transaction_currency_pair":["DCSext.currencyPair","WT.currencyPair"],"vam_id":["DCSext.vam_id"],"vam_action":["DCSext.vam_action"]};window.utag_extn=window.utag_extn||{};var utag_extn=window.utag_extn;utag_extn.data_layer_config=utag_extn.data_layer_config||event_data_config;event_data_config=utag_extn.data_layer_config;function toType(obj){return({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();}
utag_extn.webtrends_dcsmultitrack={};utag_extn.webtrends_dcsmultitrack.add_mapping=function(teal_name,sources){if(toType(sources)!=="array"){sources=[sources];}
event_data_config[teal_name]=event_data_config[teal_name]||[];for(var i=0;i<sources.length;i++){event_data_config[teal_name].push(sources[i]);}};function findDataLayerName(wt_name){for(var teal_name in event_data_config){var possible_sources=event_data_config[teal_name];if(typeof possible_sources==="string"){possible_sources=[possible_sources];}
for(var i=0;i<possible_sources.length;i++){if(possible_sources[i]===wt_name){return teal_name;}}}
return null;}
var wt_dl_mappings=utag.data.wt_dl_mappings;window.dcsMultiTrack=function(){var args=arguments;var event_type;var event_data={event_source:"legacy-dcsMultiTrack"};for(var i=0;i<args.length;i+=2){var wt_name=args[i],value=args[i+1];if(wt_name==="WT.dl"){event_type=""+value;event_data.event_type=event_type;if(wt_dl_mappings[event_type]){event_data.event_name=wt_dl_mappings[event_type];}}
var teal_name=findDataLayerName(wt_name);if(teal_name){event_data[teal_name]=value;}}
if(event_type==="0"){utag.track("view",event_data);}else{utag.track("link",event_data);}};})(window);}];u.send=function(a,b,c,d,e,f,g){if(u.ev[a]||typeof u.ev.all!="undefined"){for(c=0;c<u.extend.length;c++){try{d=u.extend[c](a,b);if(d==false)return}catch(e){}};c={_cb:Math.random()};u.o.dcsVar();u.o.dcsMeta();u.o.dcsAdv();for(d in utag.loader.GV(u.map)){try{if(typeof b[d]!=="undefined"&&b[d]!==""){c[u.map[d]]=b[d];}}catch(e){};}
for(d in utag.loader.GV(c)){e=d.split(",");for(f=0;f<e.length;f++){if(e[f].indexOf(".")>0){g=e[f].split(".");try{u.o[g[0]][g[1]]=c[d];}catch(e){}}else{try{u.o[e[f]]=c[d];}catch(e){}}}}
u.o.dcsCollect();}}
try{utag.o[loader].loader.LOAD(id)}catch(e){utag.loader.LOAD(id)}})('2','hsbc.hk-cmb-hangseng');}catch(e){}
