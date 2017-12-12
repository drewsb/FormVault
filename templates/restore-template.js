var url = window.location.href;
var urlParser = new URLParser(window.location.href);
var url = urlParser.removeFragment();
window.parser.initializeTemplate(url);