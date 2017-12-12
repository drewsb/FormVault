$(function () {

  $('#restore').click(function () {
    chrome.tabs.executeScript(null, {code:
      'var url = window.location.href; var markup = document.documentElement.innerHTML;' +
      'var urlParser = new URLParser(window.location.href);' +
      'var url = urlParser.removeFragment(); window.parser.restore(url)'});
  });

  $('#save-template').click(function () {
    chrome.tabs.executeScript(null, {code:
      'var url = window.location.href;' +
      'var urlParser = new URLParser(window.location.href);' +
      'var url = urlParser.removeFragment(); window.parser.saveTemplate(url)'});
  });

  $('#restore-template').click(function () {
    chrome.tabs.executeScript(null, {file: 'templates/restoreTemplate.js'});
  });

  $('#edit-templates').click(function () {
    chrome.tabs.create({'url': 'templates/templates.html'});
    chrome.tabs.executeScript(null, {code: 'console.log("Editing Templates");'});
  });

  $('#clear').click(function () {
    chrome.tabs.executeScript(null, {code: 'chrome.storage.local.clear();' +
    'chrome.storage.sync.clear(); console.log("History Cleared");'});
  });



});
