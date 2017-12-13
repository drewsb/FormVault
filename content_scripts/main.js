var $form = $('form');
window.parser = new FormParser($form);


$(document).ready(function () {
  var urlParser = new URLParser(window.location.href);
  var url = urlParser.removeFragment();
  var domain = document.domain;
  $('input').change(function () {
    window.parser.parse(url);
  });
  $('select').change(function () {
    window.parser.parse(url);
  });
  $('textarea').change(function () {
    window.parser.parse(url);
  });
});

window.parser.parse();
