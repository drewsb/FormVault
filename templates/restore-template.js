var url = window.location.href;
var domain = document.domain;
var urlParser = new URLParser(window.location.href);
var url = urlParser.removeFragment();
window.parser.initializeTemplate(url, domain);