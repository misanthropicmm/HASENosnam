<!--
function cn_home(lang)
{
	var langStr = regional_code(lang);
	var html_str;
	html_str ='ht'+'tp://www.hang'+'seng.com.cn/1/2/home' + langStr;
	window.open(html_str);
	return false;
}

function regional_code(lang)
{
	if(lang == 'chi')
	{
		return("-chi");
	}
	return("");
}


function menuKeyPress(e) {
	var keynum;
	if(window.event)     // IE
		{keynum = e.keyCode}
	else if(e.which)     // Netscape/Firefox/Opera
		{keynum = e.which}

	if (keynum == 13) {  // Enter pressed
		menuSubmitSearch('e');
	}
}

function validateQuery(lang, f, searchField) {
	var query = trim(searchField.value);
	
	if (query == ''){
		searchField.focus();
		alert('Please enter search query');
		return;
	}

	var re=/[\"\<\>\'\(\)\%\[\]\\\{\}\.\^\$\*\+\?\|]/;
	if (re.test(query)){
		searchField.focus();
		alert('Invalid search query');
		return;
	}
	
	if (query.length > 50) {
		searchField.focus();
		alert('Maximum 50 characters are allowed');
		return;
	} else {
		// submit the first 50 characters only
		searchField.value = searchField.value.substring(0,50);
	}
	
	return true;	
}

function ltrim(x) {
  return x.replace(/^\s*/,'');
}

function rtrim(x) {
  return x.replace(/\s*$/,'');
}

function trim(x) {
  return ltrim(rtrim(x));
}
//-->