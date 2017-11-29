$(function () {

	// Event listening code goes here.
	// Be sure to check popup.html to learn the `id` attributes of the apply/remove filter
	// buttons and the username input box - you'll need those to listen for events!

	// HINT: You can't access window.parser here. You'll have to use chrome.tabs.executeScript
	// to call window.parser.filter and window.parser.parse.

  $('#restore').click(function () {
    chrome.tabs.executeScript(null, {code:
      'var url = window.location.href; var markup = document.documentElement.innerHTML;' +
      'var urlParser = new URLParser(window.location.href);' +
      'var url = urlParser.removeFragment(); window.parser.restore(url)'});
  });

  $('#save-template').click(function () {
    chrome.tabs.executeScript(null, {code:
      'var url = window.location.href; var markup = document.documentElement.innerHTML;' +
      'var urlParser = new URLParser(window.location.href);' +
      'var url = urlParser.removeFragment(); window.parser.saveTemplate(url)'});
  });

  $('#restore-template').click(function () {
    chrome.tabs.executeScript(null, {code:
      'var url = window.location.href; var markup = document.documentElement.innerHTML;' +
      'var urlParser = new URLParser(window.location.href);' +
      'var url = urlParser.removeFragment(); window.parser.initializeTemplate(url)'});
  });

  $('#clear').click(function () {
    chrome.tabs.executeScript(null, {code: 'chrome.storage.sync.clear(); console.log("History Cleared");'});
  });

  // Need to implement form history
  /*
  $('#form-history').click(function () {
  });
  */


});
