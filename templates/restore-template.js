var url = window.location.href;
var domain = document.domain;
var urlParser = new URLParser(window.location.href);
var url = urlParser.removeFragment();
var $form = $('form');
window.parser = new FormParser($form);
window.parser.initializeTemplate(url, domain);
chrome.storage.local.get('isFromPopup', function (value) {
    if(value["isFromPopup"]) {
        chrome.runtime.sendMessage({type: "restored"}, function(response) {
            console.log("Template Restored");
        });
    }
});