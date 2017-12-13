$(function () {
  $('#restore').click(function () {
    chrome.tabs.executeScript(null, {code:
      'var url = window.location.href; var markup = document.documentElement.innerHTML;' +
      'var urlParser = new URLParser(window.location.href);' +
      'var url = urlParser.removeFragment(); window.parser.restore(url)'});
    (this).blur();
  });

  $('#save-template').click(function () {
    chrome.tabs.executeScript(null, {code:
      'var url = window.location.href;' +
      'var urlParser = new URLParser(window.location.href);' +
      'var url = urlParser.removeFragment(); window.parser.saveTemplate(url)'});
    $(this).blur();
  });

  $('#restore-template').click(function () {
    chrome.tabs.executeScript(null, {file: 'templates/restore-template.js'});
    $(this).blur();
  });

  $('#edit-templates').click(function () {
    chrome.tabs.create({'url': 'templates/templates.html'});
    chrome.tabs.executeScript(null, {code: 'console.log("Editing Templates");'});
    $(this).blur();
  });

  $('#clear').click(function () {
    chrome.tabs.executeScript(null, {code: 'if (confirm("Are you sure you want to clear your history?") == true) {' +
    'chrome.storage.local.clear(); chrome.storage.sync.clear();' +
    'console.log("History Cleared"); };'
    });
    $(this).blur();
  });
});
