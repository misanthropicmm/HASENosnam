//tealium universal tag - utag.289 ut4.0.201801290631, Copyright 2018 Tealium.com Inc. All Rights Reserved.
window.lpTag=window.lpTag||{};lpTag.sdes=lpTag.sdes||[];window.lpTag.autoStart=false;function tealium_liveperson_lib(_site,_section){if(({}).toString.call(_section).match(/\s([a-zA-Z]+)/)[1].toLowerCase()!=="array"){_section=_section?_section.toString():"";_section=_section.split(/\s*,\s*/g);}
window.lpTag=window.lpTag||{};if(typeof window.lpTag._tagCount==='undefined'){window.lpTag={site:_site||'',section:_section,autoStart:lpTag.autoStart===false?false:true,ovr:lpTag.ovr||{},_v:'1.6.0',_tagCount:1,protocol:'https:',events:{bind:function(app,ev,fn){lpTag.defer(function(){lpTag.events.bind(app,ev,fn);},0);},trigger:function(app,ev,json){lpTag.defer(function(){lpTag.events.trigger(app,ev,json);},1);}},defer:function(fn,fnType){if(fnType==0){this._defB=this._defB||[];this._defB.push(fn);}else if(fnType==1){this._defT=this._defT||[];this._defT.push(fn);}else{this._defL=this._defL||[];this._defL.push(fn);}},load:function(src,chr,id){var t=this;setTimeout(function(){t._load(src,chr,id);},0);},_load:function(src,chr,id){var url=src;if(!src){url=this.protocol+'//'+((this.ovr&&this.ovr.domain)?this.ovr.domain:'lptag.liveperson.net')+'/tag/tag.js?site='+this.site;}var s=document.createElement('script');s.setAttribute('charset',chr?chr:'UTF-8');if(id){s.setAttribute('id',id);}s.setAttribute('src',url);document.getElementsByTagName('head').item(0).appendChild(s);},init:function(){this._timing=this._timing||{};this._timing.start=(new Date()).getTime();var that=this;if(window.attachEvent){window.attachEvent('onload',function(){that._domReady('domReady');});}else{window.addEventListener('DOMContentLoaded',function(){that._domReady('contReady');},false);window.addEventListener('load',function(){that._domReady('domReady');},false);}if(typeof(window._lptStop)=='undefined'){this.load();}},start:function(){this.autoStart=true;},_domReady:function(n){if(!this.isDom){this.isDom=true;this.events.trigger('LPT','DOM_READY',{t:n});}this._timing[n]=(new Date()).getTime();},vars:lpTag.vars||[],dbs:lpTag.dbs||[],ctn:lpTag.ctn||[],sdes:lpTag.sdes||[],ev:lpTag.ev||[]};lpTag.init();}else{window.lpTag._tagCount+=1;}}
if("true"==="false"){tealium_liveperson_lib("32183061","");}
try{(function(id,loader){var u={};utag.o[loader].sender[id]=u;if(utag.ut===undefined){utag.ut={};}
if(utag.ut.loader===undefined){u.loader=function(o){var b,c,l,a=document;if(o.type==="iframe"){b=a.createElement("iframe");o.attrs=o.attrs||{"height":"1","width":"1","style":"display:none"};for(l in utag.loader.GV(o.attrs)){b.setAttribute(l,o.attrs[l]);}b.setAttribute("src",o.src);}else if(o.type=="img"){utag.DB("Attach img: "+o.src);b=new Image();b.src=o.src;return;}else{b=a.createElement("script");b.language="javascript";b.type="text/javascript";b.async=1;b.charset="utf-8";for(l in utag.loader.GV(o.attrs)){b[l]=o.attrs[l];}b.src=o.src;}if(o.id){b.id=o.id};if(typeof o.cb=="function"){if(b.addEventListener){b.addEventListener("load",function(){o.cb()},false);}else{b.onreadystatechange=function(){if(this.readyState=='complete'||this.readyState=='loaded'){this.onreadystatechange=null;o.cb()}};}}l=o.loc||"head";c=a.getElementsByTagName(l)[0];if(c){utag.DB("Attach to "+l+": "+o.src);if(l=="script"){c.parentNode.insertBefore(b,c);}else{c.appendChild(b)}}}}else{u.loader=utag.ut.loader;}
if(utag.ut.typeOf===undefined){u.typeOf=function(e){return({}).toString.call(e).match(/\s([a-zA-Z]+)/)[1].toLowerCase();};}else{u.typeOf=utag.ut.typeOf;}
if(utag.ut.isEmptyObject===undefined){u.isEmptyObject=function(o,a){for(a in o){if(utag.ut.hasOwn(o,a)){return false;}}return true;};}else{u.isEmptyObject=utag.ut.isEmptyObject;}
if(utag.ut.hasOwn===undefined){utag.ut.hasOwn=function(o,a){return o!=null&&Object.prototype.hasOwnProperty.call(o,a);};}
if(utag.ut.merge===undefined){u.merge=function(a,b,c,d){if(c){for(d in utag.loader.GV(b)){a[d]=b[d];}}else{for(d in utag.loader.GV(b)){if(typeof a[d]=="undefined"){a[d]=b[d];}}}};}else{u.merge=utag.ut.merge;}
u.ev=utag.data.vendor_liveperson_eventlist;u.initialized=false;u.view_count=0;u.calc_items=function(quan){var q,i=0;for(q=0;q<quan.length;q++){i+=parseInt(quan[q]);}
return i;};u.remove_empty=function(a){var b,t;for(b in utag.loader.GV(a)){t=u.typeOf(a[b]);if(t==="object"){u.remove_empty(a[b]);if(u.isEmptyObject(a[b])){try{delete a[b];}catch(e){a[b]=undefined;}}}else if(!((a[b]===0||a[b]===false)?!0:(t==="array"&&a[b].length===0)?!1:!!a[b])){try{delete a[b];}catch(e){a[b]=undefined;}}}
return a;};u.map_func=function(arr,obj,item){var i=arr.shift();obj[i]=obj[i]||{};if(arr.length>0){u.map_func(arr,obj[i],item);}else{obj[i]=item;}};u.add_prod=function(ecom,f){return{"name":ecom.product_name[f],"category":ecom.product_category[f],"sku":ecom.product_sku[f],"price":parseFloat(ecom.product_unit_price[f])}};u.contains_data=function(data){var c,count=0;for(c in data){if(utag.ut.hasOwn(data,c)){if(++count>1){return true;}}}
return false;};u.map={"vendor_liveperson_product_name":"cart.product_name,product_name","vendor_liveperson_full_url":"url,u","page_language":"vi.ctype","vendor_liveperson_event_type":"type","vendor_liveperson_section":"section","customer_type":"vi.cstatus","vendor_liveperson_productsincart":"cart.product_name","vendor_liveperson_campaignid":"ms.campaignId","vendor_liveperson_servicetopic":"serv.topic","vendor_liveperson_errorcode":"err.code","vendor_liveperson_servicecategory":"serv.category","vendor_liveperson_servicestatus":"serv.status"};u.extend=[function(a,b){try{if((typeof b['transaction_execution_type']!='undefined'&&typeof b['product_sku']!='undefined')){try{b['vendor_liveperson_product_name']=[b.product_sku+"-"+b.transaction_execution_type];}catch(e){}}}catch(e){utag.DB(e)}},function(a,b){try{if(typeof b['page_url']!='undefined'){try{b['vendor_liveperson_full_url']=window.location.protocol+"//"|+document.domain+b.page_url;}catch(e){}}}catch(e){utag.DB(e)}},function(a,b){try{if(1){try{b['vendor_liveperson_event_type']=['ctmrinfo','cart','mrktInfo','service','error'];}catch(e){}}}catch(e){utag.DB(e)}},function(a,b){try{if(1){try{b['vendor_liveperson_section']=b.page_url.replace(/^\//,"").replace(/\//g,"_");}catch(e){};b['vendor_liveperson_campaignid']=b['campaign_id']}}catch(e){utag.DB(e)}},function(a,b){try{if(b['event_type'].toString().indexOf('lpconversion')>-1){b['vendor_liveperson_servicetopic']=b['event_action']}}catch(e){utag.DB(e)}},function(a,b){b['vendor_liveperson_productsincart']=[];if(b['product_category_code']){b['vendor_liveperson_productsincart'].push('product_category_code-'+b['product_category_code']);}
if(b['page_security_level']){b['vendor_liveperson_productsincart'].push('page_security_level-'+b['page_security_level']);}
if(b['customer_type']){b['vendor_liveperson_productsincart'].push('customer_type-'+b['customer_type']);}
var custLocale=b['site_region']+" "+b["site_subregion"]+" "+b["site_country"]+" "+b["site_entity"]+" "+b["site_brand"]
b['vendor_liveperson_productsincart'].push("site_region-"+custLocale.split(' ').join('_'));},function(a,b){try{if(1){if(b.vendor_liveperson_testsiteid&&(b.site_domain_type!=="prod"||b["ut.env"]!=="prod")){u.data.site=b.vendor_liveperson_testsiteid;}}}catch(e){utag.DB(e)}}];u.send=function(a,b){if(u.ev[a]||u.ev.all!==undefined){if(a=="livechat"){a="view";}
else if(a=="cobrowse"){if(b["cobrowsestate"]=="verify"){window.verifyCobrowse(b["session_id"]);}
else if(b["cobrowsestate"]=="authenticate"){window.requestCobrowse(b["session_id"]);}}
var c,d,e,f,g,data,type,ecom,sdes_array=[],_event=[];u.data={"site":"32183061","section":"","type":"","merge_ecom":"true","product_name":[],"product_sku":[],"product_category":[],"product_quantity":[],"product_unit_price":[],"vi":{},"ms":{},"per":{},"lead":{},"serv":{},"err":{},"ecom":{},"ecom_blank":{"order_id":"","order_total":"","product_name":[],"product_sku":[],"product_category":[],"product_quantity":[],"product_unit_price":[]}};for(c=0;c<u.extend.length;c++){try{d=u.extend[c](a,b);if(d==false)return}catch(e){}};c=[];for(d in utag.loader.GV(u.map)){if(b[d]!==undefined&&b[d]!==""){e=u.map[d].split(",");for(f=0;f<e.length;f++){u.map_func(e[f].split("."),u.data,b[d]);}}else{h=d.split(":");if(h.length==2&&b[h[0]]){e=b[h[0]].split(/\s*,\s*/);for(f=0;f<e.length;f++){if(e[f]===h[1]&&u.map[d]){_event=_event.concat(u.map[d].split(","));}}}}}
if(u.view_count==0&&"true"==="true"){tealium_liveperson_lib(u.data.site,u.data.section);}
u.data.customer_id=u.data.customer_id||b._ccustid||"";ecom=u.data.ecom;ecom.order_id=u.data.order_id||b._corder||"";ecom.order_total=u.data.order_total||b._ctotal||"";if(u.data.product_name.length===0&&b._cprodname!==undefined){ecom.product_name=b._cprodname.slice(0);}else{ecom.product_name=u.data.product_name.slice(0);}
if(u.data.product_sku.length===0&&b._csku!==undefined){ecom.product_sku=b._csku.slice(0);}else{ecom.product_sku=u.data.product_sku.slice(0);}
if(u.data.product_category.length===0&&b._ccat!==undefined){ecom.product_category=b._ccat.slice(0);}else{ecom.product_category=u.data.product_category.slice(0);}
if(u.data.product_quantity.length===0&&b._cquan!==undefined){ecom.product_quantity=b._cquan.slice(0);}else{ecom.product_quantity=u.data.product_quantity.slice(0);}
if(u.data.product_unit_price.length===0&&b._cprice!==undefined){ecom.product_unit_price=b._cprice.slice(0);}else{ecom.product_unit_price=u.data.product_unit_price.slice(0);}
c=u.typeOf(u.data.type);if(c!=="array"&&u.data.type){u.data.type=u.data.type.toString().split(/\s*,\s*/);}else if(c==="undefined"){u.data.type=[];}
if(u.data.type.length>1){_event=_event.concat(u.data.type);}
if('view'===a){u.view_count++;}
for(g=0;g<_event.length;g++){data=undefined;type=_event[g];u.data[type]=u.data[type]||{};if(u.data.merge_ecom==="true"){u.merge(u.data[type],utag.handler.C(u.data.ecom));}else{u.merge(u.data[type],utag.handler.C(u.data.ecom_blank));}
if(type==="cart"){ecom=u.data.cart;data={"type":type,"total":parseFloat(ecom.order_total),"numItems":u.calc_items(ecom.product_quantity),"products":[]};for(f=0;f<ecom.product_name.length;f++){data.products.push({"product":u.add_prod(ecom,f),"quantity":parseInt(ecom.product_quantity[f])});}
if(data.products.length===0){try{delete data["numItems"];}catch(e){data["numItems"]=undefined;}}}else if(type==="purchase"){ecom=u.data.purchase;data={"type":type,"cart":{"products":[]}};if(ecom.order_total){data.total=parseFloat(ecom.order_total);}
if(ecom.order_id){data.orderId=ecom.order_id;}
for(f=0;f<ecom.product_name.length;f++){data.cart.products.push({"product":u.add_prod(ecom,f),"quantity":parseInt(ecom.product_quantity[f])});}}else if(type==="prodView"){ecom=u.data.prodView;data={"type":type,"products":{"product":[]}};for(f=0;f<ecom.product_name.length;f++){data.products.product.push(u.add_prod(ecom,f));}}
else if(type==="ctmrinfo"){data={"type":type,"info":{"cstatus":u.data.vi.cstatus,"customerId":u.data.customer_id,"ctype":u.data.vi.ctype,"balance":parseFloat(u.data.vi.balance),"socialId":u.data.vi.socialId,"imei":u.data.vi.imei,"userName":u.data.vi.userName,"companySize":parseInt(u.data.vi.companySize),"accountName":u.data.vi.accountName,"role":u.data.vi.role,"lastPaymentDate":{"day":parseInt(u.data.vi.lpd_day),"month":parseInt(u.data.vi.lpd_month),"year":parseInt(u.data.vi.lpd_year)},"registrationDate":{"day":parseInt(u.data.vi.rd_day),"month":parseInt(u.data.vi.rd_month),"year":parseInt(u.data.vi.rd_year)}}};}else if(type==="mrktInfo"){data={"type":type,"info":{"channel":u.data.ms.channel,"affiliate":u.data.ms.affiliate,"campaignId":u.data.ms.campaignId}};}else if(type==="personal"){data={"type":type,"personal":{"firstname":u.data.per.firstname,"lastname":u.data.per.lastname,"age":{"age":parseInt(u.data.per.age),"year":parseInt(u.data.per.year),"month":parseInt(u.data.per.month),"day":parseInt(u.data.per.day)},"contacts":[],"gender":u.data.per.gender,"company":u.data.per.company}};if(u.typeOf(u.data.per.email)!=="array"){u.data.per.email=[u.data.per.email];}
if(u.typeOf(u.data.per.phone)!=="array"){u.data.per.phone=[u.data.per.phone];}
for(f=0;f<u.data.per.email.length;f++){data.personal.contacts.push({"email":u.data.per.email[f],"phone":u.data.per.phone[f]});}}else if(type==="lead"){data={"type":type,"lead":{"topic":u.data.lead.topic}};if(u.data.lead.value){data.lead.value=parseFloat(u.data.lead.value);}
if(u.data.lead.id){data.lead.leadId=u.data.lead.id;}}else if(type==="service"){data={"type":type,"service":{"topic":u.data.serv.topic,"status":parseInt(u.data.serv.status),"category":u.data.serv.category,"serviceId":u.data.serv.id}}}else if(type==="error"){data={"type":type,"error":{"message":u.data.err.msg,"code":u.data.err.code}};}
if(data){u.remove_empty(data);if(u.contains_data(data)){sdes_array.push(data);lpTag.sdes.push(data);}}}
if('view'===a&&u.view_count>1){c=u.typeOf(u.data.section);if(c!=="array"&&u.data.section){u.data.section=u.data.section.toString().split(/\s*,\s*/);}else{u.data.section=u.data.section||[];}
f={sdes:sdes_array};if(u.data.taglets){f.taglets=u.data.taglets;}
if(c!=="undefined"&&u.data.section.length>0){f.section=u.data.section;}
if(b['page_url']){lpTag.newPage(window.location.protocol+"//"+b['dom.domain']+b['page_url'],f);}
else{lpTag.newPage(b['dom.url'],f);}}
if(!u.initialized){u.initialized=!0;(function(){var firstTry=true,tryAgain;var _lpStopTrying=function(){clearInterval(tryAgain);};var startLETag=function(){if(lpTag.start){lpTag.isDom=true;lpTag.start();_lpStopTrying();}else if(firstTry){firstTry=false;tryAgain=setInterval(startLETag,100);}};startLETag();})();}
}};utag.o[loader].loader.LOAD(id);}("289","hsbc.hk-cmb-hangseng"));}catch(error){utag.DB(error);}
