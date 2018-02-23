// This file was automatically generated from hsbc-template-onboarding-web.soy.
// Please don't edit this file by hand.

if (typeof templates_hsbcTemplateOnboarding == 'undefined') { var templates_hsbcTemplateOnboarding = {}; }


templates_hsbcTemplateOnboarding.hsbcTemplateOnboarding = function(opt_data, opt_ignored) {
  var output = '<div class="bp-container hsbc-template-onboarding odct-template" data-pid="' + soy.$$escapeHtml(opt_data.item.name) + '"><div class="odct-container"><div id="hsbc-odct-left-container" class="hsbc-odct-left-container"><div class="bp-area odct-template--area">';
  var childList6 = opt_data.item.children;
  var childListLen6 = childList6.length;
  for (var childIndex6 = 0; childIndex6 < childListLen6; childIndex6++) {
    var childData6 = childList6[childIndex6];
    output += (parseInt(childData6.preferences.area.value,10) == 0) ? soy.$$filterNoAutoescape("") : '';
  }
  output += '</div></div><div id="hsbc-odct-right-container" class="hsbc-odct-right-container"><header id="hsbc-odct-header"><div class="row"><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><div class="bp-area odct-template--area">';
  var childList13 = opt_data.item.children;
  var childListLen13 = childList13.length;
  for (var childIndex13 = 0; childIndex13 < childListLen13; childIndex13++) {
    var childData13 = childList13[childIndex13];
    output += (parseInt(childData13.preferences.area.value,10) == 1) ? soy.$$filterNoAutoescape("") : '';
  }
  output += '</div></div></div></header><section id="hsbc-odct-middle-container"><div class="row"><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><div class="bp-area odct-template--area">';
  var childList20 = opt_data.item.children;
  var childListLen20 = childList20.length;
  for (var childIndex20 = 0; childIndex20 < childListLen20; childIndex20++) {
    var childData20 = childList20[childIndex20];
    output += (parseInt(childData20.preferences.area.value,10) == 2) ? soy.$$filterNoAutoescape("") : '';
  }
  output += '</div></div></div></section><footer><div class="row"><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><div class="bp-area odct-template--area">';
  var childList27 = opt_data.item.children;
  var childListLen27 = childList27.length;
  for (var childIndex27 = 0; childIndex27 < childListLen27; childIndex27++) {
    var childData27 = childList27[childIndex27];
    output += (parseInt(childData27.preferences.area.value,10) == 3) ? soy.$$filterNoAutoescape("") : '';
  }
  output += '</div></div></div></footer></div></div></div>';
  return output;
};
