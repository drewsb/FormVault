var $form = $('form');
window.parser = new FormParser($form);


$(document).ready(function() {
	var urlParser = new URLParser(window.location.href);
	var url = urlParser.removeFragment();
	var markup = document.documentElement.innerHTML;

	$('input').change(function() {
   	window.parser.parse(url, markup);
  });
  $('select').change(function() {
   		window.parser.parse(url, markup);
  });
  $('textarea').change(function() {
    console.log("CHANGED")
   		window.parser.parse(url, markup);
  });
});

window.parser.parse();
